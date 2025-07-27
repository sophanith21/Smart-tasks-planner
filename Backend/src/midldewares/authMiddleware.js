import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  try {
    if (!token) {
      return res.status(400).json({ message: "No token has been provided" });
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedToken;
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Invalid token or token is expired" });
  }
}
