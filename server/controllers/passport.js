import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import users from "../models/users.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    async(accessToken, refreshToken, profile, done)=>{
        try{
            const googleID = profile.id;
            const email = profile.emails?.[0]?.value??null;

            //check if user already exists
            let user = await users.findOne({
                email : email
            })

            //cerate new user if user dont exists
            if(!user){
                user = await users.create({
                    name: profile.displayName,
                    email: email,
                    password: "Google-OAuth",
                    isVerified: true,
                    role: 'user'
                });
            }
            return done(null,user);
        }
        catch(e){
            return done(e,null);
        }
    }
  ),
);
