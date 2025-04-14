import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";

export const tokenVerify = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).send("Authentication token missing");
    }

    if (token) {
      jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
          res.send(err);
        } else {
          req.user = user;
          console.log(req.user);

          next();
        }
      });
    } else {
      res.status(404).send("not authenticate");
    }
  } catch (error) {
    res.send(error);
  }
};

export const verifyTokenAdmin = (req, res, next) => {
  tokenVerify(req, res, async () => {
    if (!req.user) {
      return next(new CustomError("You are not authorized", 401));
    }
    if (req.user.role !== "admin") {
      return next(new CustomError("You are not an admin", 401));
    }
    await next();
  });
};
