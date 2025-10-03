const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs")
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const register= async(req, res)=>{
    try {
      console.log("✅ req.body:", req.body); 
       const {username, email, password} = req.body;
         
        if(!username || !email || !password ){
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            return res.status(409).json({
                message: "User Already exists"
            })
        }

        const salt= await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
 
        const newUser = new userModel({
            username,
            email,
            password:hashedPassword
        });

        await newUser.save();

        res.status(200).json({
            message: "Account Created Successfully."
        })

    } catch (error) {
        console.log("Error in registering", error);
        res.status(500).json({message: "Something went wrong", error: error.message})
    }
}





const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const { password: _, ...userWithoutPassword } = user._doc;

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.status(200).json({
      msg: 'Login successful',
      token, // ✅ token added here
      user: userWithoutPassword,
    });

  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};



// Delete a user by ID
 const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};


const changePassword = async (req, res) => {
  try {
    console.log("req.user:", req.user); // ✅ log for debug

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    // TODO: Lookup user from DB and change password
    return res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports ={register,login,getAllUsers,deleteUser,changePassword};