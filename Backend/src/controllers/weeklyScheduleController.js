import db from "../models/index.js";

export async function getWeeklySchedule(req, res) {
  const user = req.user;
  try {
    const schedule = await db.WeeklySchedule.findOne({
      where: { UserId: user.id },
      include: db.WeeklyScheduleDetails,
    });
    if (!schedule) {
      return res
        .status(404)
        .json({ error: "No schedule found for this user." });
    }
    const data = schedule["WeeklyScheduleDetails"];
    const uniqueTime = [...new Set(data.map((e) => e.time))];

    let constructedData = [];
    uniqueTime.forEach((index) => {
      let row = { [index]: [] };
      data.forEach((i) => {
        if (index == i.time) {
          row[index].push({
            id: i.id,
            day: i.day,
            content: i.content,
            WeeklyScheduleId: i.WeeklyScheduleId,
          });
        }
      });
      constructedData.push(row);
    });
    res.json({ constructedData, WeeklyScheduleId: schedule.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createNewSchedule(req, res) {
  const user = req.user;
  try {
    const result = await db.WeeklySchedule.create({ UserId: user.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteWeeklySchedule(req, res) {
  const user = req.user;
  try {
    const result = await db.WeeklySchedule.destroy({
      where: { UserId: user.id },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateWeeklySchedule(req, res) {
  const user = req.user;
  const { id, time, day, WeeklyScheduleId, content, oldTime } = req.body;
  console.log(req.body);
  try {
    const test = await db.WeeklySchedule.findOne({
      where: { UserId: user.id },
    });

    if (test.id != WeeklyScheduleId) {
      return res
        .status(401)
        .json({ error: "Unauthorized Access" + test.id + WeeklyScheduleId });
    }

    if (oldTime != null) {
      const result = await db.WeeklyScheduleDetails.update(
        { time: time },
        { where: { time: oldTime, WeeklyScheduleId: WeeklyScheduleId } }
      );
      if (result[0] === 0) {
        const addNewRow = await db.WeeklyScheduleDetails.create({
          time,
          content: "",
          WeeklyScheduleId,
          day: day ?? "Monday",
        });
        return res.json(addNewRow);
      }
      return res.json(result);
    }

    const result = await db.WeeklyScheduleDetails.update(
      { content: content },
      {
        where: {
          time: time,
          WeeklyScheduleId: WeeklyScheduleId,
          id: id,
        },
      }
    );
    if (result[0] === 0) {
      const addNewRow = await db.WeeklyScheduleDetails.create({
        time,
        content,
        WeeklyScheduleId,
        day,
      });
      return res.json(addNewRow);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteWeeklyScheduleRow(req, res) {
  const user = req.user;

  const { time } = req.query;

  try {
    const schedule = await db.WeeklySchedule.findOne({
      where: { UserId: user.id },
    });
    const result = await db.WeeklyScheduleDetails.destroy({
      where: { time: time, WeeklyScheduleId: schedule.id },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
