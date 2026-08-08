import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, generateVerificationToken } from "../utils/emailService.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookieOptions.js";

//ACCESS TOKEN
export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.JWT_EXPIRES_IN,
    },
  );
}

//REFRESH TOKEN
export function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
}

async function Signup(req, res) {
  try {
    const { email, password, name } = req.body;

    // console.log("signup request");
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      email,
      password: hashedpassword,
      name,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Still allow user to sign up even if email fails
    }

    await user.save();

    res.json({
      message: "Signup successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error!",
    });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "User password not set",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in.",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    res
      .cookie("accessToken", accessToken, accessCookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .status(200)
      .json({
        message: "Login Successfull",
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error!",
    });
  }
}
const LogoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $unset: {
        refreshToken: 1,
      },
    });

    return res
      .clearCookie("accessToken", accessCookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions)
      .status(200)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const RefreshUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No refresh token",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email.",
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie("accessToken", newAccessToken, accessCookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
      .status(200)
      .json({
        message: "Token refreshed",
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};
export { Signup, Login, LogoutUser };

export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user.addresses || []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, state, country, postalCode, isDefault } = req.body;
    if (!fullName || !phone || !address || !city || !state || !country || !postalCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    const isFirstAddress = user.addresses.length === 0;

    user.addresses.push({
      fullName,
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      isDefault: isFirstAddress || isDefault
    });

    await user.save();
    return res.status(201).json(user.addresses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, state, country, postalCode, isDefault } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addr = user.addresses.find(a => String(a._id) === String(req.params.addressId));
    if (!addr) return res.status(404).json({ message: "Address not found" });

    if (isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    addr.fullName = fullName || addr.fullName;
    addr.phone = phone || addr.phone;
    addr.address = address || addr.address;
    addr.city = city || addr.city;
    addr.state = state || addr.state;
    addr.country = country || addr.country;
    addr.postalCode = postalCode || addr.postalCode;
    addr.isDefault = isDefault !== undefined ? isDefault : addr.isDefault;

    await user.save();
    return res.json(user.addresses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(a => String(a._id) !== String(req.params.addressId));
    
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return res.json(user.addresses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
