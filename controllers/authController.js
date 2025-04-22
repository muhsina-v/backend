import jwt from "jsonwebtoken";
import User from "../models/usersSchema.js";
import bcrypt from "bcryptjs";
import CustomError from "../utils/customError.js";
import { joiUserSchema } from "../models/joiValSchema.js";

// createToken
const createToken = (id, role, expiresIn) => {
  return jwt.sign({ id, role }, process.env.JWT_TOKEN, { expiresIn });
};

const userRegister = async (req, res, next) => {
  //validating with joi
  const { value, error } = joiUserSchema.validate(req.body);
  const { name, email, password } = value;
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  // emailChecking
  const exists = await User.findOne({ email });
  if (exists) {
    return next(new CustomError("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  // adding user to db
  await newUser.save();
  res.json({ success: true, message: "user registered" });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("User doesn't exist", 401));
  }

  if (user.isBlocked) {
    return next(new CustomError("User is Blocked", 403));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new CustomError("Invalid credentials", 401));
  }
  if (user.role === "admin") {
    return next(
      new CustomError(
        "Access denied. Nice try though, but this is the user zone :)",
        403
      )
    );
  }
  // creating token for logged user
  const token = createToken(user._id, user.role, "7d");
  await user.save();

  //admin

  const currentUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  res.json({ message: "user successfully logged in", token, currentUser });
};

const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("User doesn't exist", 401));
  }
  if (user.role !== "admin") {
    return next(new CustomError("You are not an admin", 403));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // creating token for logged admin
  const token = createToken(user._id, user.role, "7d");
  await user.save();

  const currentUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({ message: "Admin successfully logged in", token, currentUser });
};

//  logout
const logout = async (req, res, next) => {
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
};

export { userRegister, loginUser, adminLogin, logout };
