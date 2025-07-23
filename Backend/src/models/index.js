import UserModel from "./user.js";
import TasksModel from "./Task.js";
import WeeklyScheduleModel from "./WeeklySchedule.js";
import WeeklyScheduleDetailsModel from "./WeeklyScheduleDetails.js";
import sequelize from "../configs/dbconnection.js";

let db = {};

db.User = UserModel;
db.Tasks = TasksModel;
db.WeeklySchedule = WeeklyScheduleModel;
db.WeeklyScheduleDetails = WeeklyScheduleDetailsModel;

db.User.hasMany(db.Tasks);
db.Tasks.belongsTo(db.User);

db.User.hasOne(db.WeeklySchedule);
db.WeeklySchedule.belongsTo(db.User);

db.WeeklySchedule.hasMany(db.WeeklyScheduleDetails);
db.WeeklyScheduleDetails.belongsTo(db.WeeklySchedule);

await sequelize.sync({ alter: true });

export default db;
