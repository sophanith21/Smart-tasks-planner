import db from "../models/index.js";

export async function createSuggestion(req, res) {
  const { suggestion, reason, title, description } = req.body;
  const user = req.user;
  try {
    const newSuggestion = await db.Suggestion.create({
      UserId: user.id,
      title: title ? title : "",
      description: description ? description : "",
      reason: reason ? reason : "",
    });
    const result = await Promise.all(
      suggestion.map(async (s) => {
        if (s.suggested_time) {
          return db.SuggestionDetails.create({
            SuggestionId: newSuggestion.id,
            TaskId: s.taskId,
            suggested_time: s.suggested_time,
          });
        }
      })
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getSuggestions(req, res) {
  const user = req.user;
  try {
    const result = await db.Suggestion.findAll({ where: { UserId: user.id } });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateSuggestion(req, res) {
  const user = req.user;
  const id = req.params.id;
  const { suggested_time } = req.body;
  try {
    const result = await db.SuggestionDetails.update(
      { suggested_time },
      { where: { id: id } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSuggestionDetails(req, res) {
  const suggestionId = req.params.id;
  try {
    const result = await db.SuggestionDetails.findAll({
      where: { SuggestionId: suggestionId },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteSuggestion(req, res) {
  const suggestionId = req.params.id;
  console.log(suggestionId);
  try {
    const result = await db.Suggestion.destroy({
      where: { id: suggestionId },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
