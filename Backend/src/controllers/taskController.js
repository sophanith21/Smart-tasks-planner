import db from "../models/index.js";

export async function getAllTasks(req, res) {
  const user = req.user;
  console.log(user);
  try {
    const tasks = await db.Tasks.findAll({ where: { UserId: user.id } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTask(req, res) {
  const user = req.user;
  const { updateField } = req.body;
  const id = req.params.id;
  console.log(updateField);
  try {
    const result = await db.Tasks.update(updateField, {
      where: { id: id, UserId: user.id },
    });
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTask(req, res) {
  const user = req.user;
  const id = req.params.id;
  try {
    const result = await db.Tasks.destroy({
      where: { id: id, UserId: user.id },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function addTask(req, res) {
  const { title, description, deadline, suggested_time } = req.body;
  console.log(5);
  const user = req.user;
  try {
    await db.User.create({
      name: "root",
      email: "root@gmail.com",
      password: "10",
    });
    const result = await db.Tasks.create({
      title,
      description,
      deadline,
      suggested_time,
      UserId: user.id,
    });
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
