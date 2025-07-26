import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User registration
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const findUser = await db.User.findOne({ where: { email } });
    if (findUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: " User has successfully registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
