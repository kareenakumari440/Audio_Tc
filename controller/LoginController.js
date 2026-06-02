const user = require('../model/user');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {

    // User se email aur password lena
    const { email, passwords } = req.body;

    // Email check karna
    const existingUser = await user.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Password compare karna
    const isMatch = await bcrypt.compare(
      passwords,
      existingUser.passwords
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });
    }

    // Login Success
    res.status(200).json({
      success: true,
      message: "Login Successful"
    });

  } catch (error) {
    console.log("Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = login;