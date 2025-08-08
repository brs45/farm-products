const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.SECRET_JWT;


const signup = async (req, res) => {

  console.log('Signup called with:', req.body);
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(401).json({ message: "Email is already taken" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const payload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    };

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      message: "New user created",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "User not found" });

    const verify = await bcrypt.compare(password, user.password);
    if (!verify)
      return res.status(401).json({ message: "Wrong password" });

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'strict',
    secure: false,
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports={
    signup,
    login,
    logout
}

