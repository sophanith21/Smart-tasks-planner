import db from "../models/index.js";

export async function getAllTasks(req, res) {
  //const { user } = req.user;
  const id = 1;
  try {
    const tasks = await db.Tasks.findAll({ where: { UserId: id } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTask(req, res) {
  const { updateField } = req.body;
  const id = req.params.id;
  //const { user } = req.user;
  console.log(updateField);
  try {
    const result = await db.Tasks.update(updateField, { where: { id: id } });
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTask(req, res) {
  const id = req.params.id;
  try {
    const result = await db.Tasks.destroy({ where: { id: id } });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function addTask(req, res) {
  const { title, description, deadline, suggested_time } = req.body;
  console.log(5);
  //const { user } = req.user;
  const id = 1;
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
      UserId: id,
    });
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
