const User = require('../models/user');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async (req, res) => {
    const { username, email, password } = req.body;

    const encryptedPassword = cryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: 'User Successfully Created' });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to create user', error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Wrong credentials, provide a valid email' });
      }

      const decryptedPass = cryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      );
      const decryptedPassword = decryptedPass.toString(cryptoJS.enc.Utf8);

      if (decryptedPassword !== password) {
        return res.status(401).json({ message: 'Wrong password' });
      }

      const userToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: userPassword, __v, ...userData } = user._doc;

      res.status(200).json({ ...userData, token: userToken });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  },
};
