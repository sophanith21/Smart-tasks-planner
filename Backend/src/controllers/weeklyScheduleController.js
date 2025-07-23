import db from "../models/index.js";

export async function getWeeklySchedule(req, res) {
  const user = req.user;
  try {
    const schedule = await db.WeeklySchedule.findOne({
      Where: { UserId: user.id },
      include: db.WeeklyScheduleDetails,
    });
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
    res.json(constructedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
