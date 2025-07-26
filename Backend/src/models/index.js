import UserModel from "./User.js";
import TasksModel from "./Task.js";
import WeeklyScheduleModel from "./WeeklySchedule.js";
import WeeklyScheduleDetailsModel from "./WeeklyScheduleDetails.js";
import sequelize from "../configs/dbconnection.js";

let db = {};

db.User = UserModel;
db.Tasks = TasksModel;

db.User.hasMany(db.Tasks);
db.Tasks.belongsTo(db.User);

await sequelize.sync({ alter: true });

export default db;
