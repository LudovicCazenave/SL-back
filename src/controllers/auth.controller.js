import jwt from 'jsonwebtoken';
import * as argon2 from "argon2";
import { Role, User, Label } from "../models/associations.js";

const jwtSecret = process.env.JWT_SECRET; // Retrieve the secret key from .env

export const authController = {

  // Handle user sign-in
  async signIn(req, res) {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe sont obligatoires.' });
    }

    // Find the user
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: "role"
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Identifiants incorrects..' }); // 
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants incorrects..' });
    }

    //Cookie
    const options = {
      maxAge: 1000 * 60 * 60 * 3, // expire after 3 hours
      httpOnly: true, // Cookie will not be exposed to client side code
      sameSite: "none", // If client and server origins are different
      secure: true // use with HTTPS only
    };

    // Generate JWT
    const jwtContent = { userId: user.id }; // Create JWT payload with user ID
    const jwtOptions = { algorithm: 'HS256', expiresIn: '3h' }; // Define JWT options, setting the algorithm and expiration time
    const token = jwt.sign(jwtContent, jwtSecret, jwtOptions); // Sign the JWT using the secret key and options

    res.cookie("token", token, options);

    // Return the token and user info
    return res.status(200).json({ 
      message: 'Connexion réussie.', 
      logged: true, 
      pseudo: user.firstname,
      token 
    });
  
  },

  async verifyToken(req, res){
    if (req.user) {
      res.status(200).json({ userId: req.user.userId, firstname: req.user.firstname });
    } else {
      res.status(401).json({ error: 'Token invalide.' });
    }
  },
  //Logs out the user by removing the authentification token
  async logout(req, res){
    res.clearCookie('token', { httpOnly: true});
    res.status(200).json({ message: 'Succès'}); 
  } 
};