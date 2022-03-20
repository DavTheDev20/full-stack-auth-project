require('dotenv').config();
require('./database/db').connect();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const req = require('express/lib/request');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.port || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).send('Working...');
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      return res.status(400).json({
        success: false,
        error: 'You must input all three fields (username, email, password)',
      });
    }

    // Finds user if email already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ success: false, error: 'User Already Exists. Please Login' });
    }

    // Encrypts user password for database
    encryptedPassword = await bcrypt.hash(password, 10);

    // Creates new user
    const user = await User.create({
      username,
      email: email.toLowerCase(), // sanitizes email
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
      }
    );

    user.token = token;

    res.status(201).json({ success: true, user: user });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
