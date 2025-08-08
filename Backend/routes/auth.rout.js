

const {signup,login,logout}=require('../controller/auth.controller.js')

const express=require('express');
const protect=require('../middleware/protect.js');
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.get('/me', protect, (req, res) => {
    res.status(200).json({ user: req.user });
 });

 router.get('/all', protect, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports=router;
