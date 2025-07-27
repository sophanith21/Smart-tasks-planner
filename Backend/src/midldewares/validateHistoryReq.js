import db from "../models/index.js";

export default async function validateHistoryReq(req, res, next) {
  const user = req.user;
  const suggestionId = req.params.id;
  console.log(user);
  console.log(suggestionId);
  try {
    const check = await db.Suggestion.findOne({
      where: { UserId: user.id, id: suggestionId },
    });
    console.log(check);
    if (!check) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
