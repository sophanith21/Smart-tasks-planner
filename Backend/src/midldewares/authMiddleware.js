export default function authMiddleware(req, res, next) {
  const authHeader = req.header["Authorization"];
  const token = authHeader?.split(" ")[1];

  try {
  } catch {}
  let user = {};
  user.id = 1;
  req.user = user;
  console.log(req.user);
  next();
}
