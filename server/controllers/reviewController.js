import Product from "../models/product.js";
import User from "../models/users.js";

export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment?.trim()) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => String(r.user) === String(req.user.userId),
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const user = await User.findById(req.user.userId).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    product.reviews.push({
      user: req.user.userId,
      name: user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.numReviews;

    await product.save();

    const updated = await Product.findById(req.params.id).populate("category", "name");
    return res.status(201).json(updated);
  } catch (error) {
    console.error("Add review error:", error);
    return res.status(500).json({ message: "Unable to add review" });
  }
};
