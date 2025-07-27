import UserModel from "./user.js";
import TasksModel from "./Task.js";
import WeeklyScheduleModel from "./WeeklySchedule.js";
import WeeklyScheduleDetailsModel from "./WeeklyScheduleDetails.js";
import SuggestionModel from "./Suggestion.js";
import SuggestionDetailModel from "./SuggestionDetail.js";
import sequelize from "../configs/dbconnection.js";

let db = {};

db.User = UserModel;
db.Tasks = TasksModel;
db.WeeklySchedule = WeeklyScheduleModel;
db.WeeklyScheduleDetails = WeeklyScheduleDetailsModel;
db.SuggestionDetails = SuggestionDetailModel;
db.Suggestion = SuggestionModel;

db.User.hasMany(db.Tasks, { onDelete: "CASCADE" });
db.Tasks.belongsTo(db.User);

db.User.hasOne(db.WeeklySchedule, { onDelete: "CASCADE" });
db.WeeklySchedule.belongsTo(db.User);

db.WeeklySchedule.hasMany(db.WeeklyScheduleDetails, { onDelete: "CASCADE" });
db.WeeklyScheduleDetails.belongsTo(db.WeeklySchedule);

db.User.hasOne(db.Suggestion, { onDelete: "CASCADE" });
db.Suggestion.belongsTo(db.User);

db.Suggestion.hasMany(db.SuggestionDetails, { onDelete: "CASCADE" });
db.SuggestionDetails.belongsTo(db.Suggestion);

db.Tasks.hasMany(db.SuggestionDetails, { onDelete: "CASCADE" });
db.SuggestionDetails.belongsTo(db.Tasks);

await sequelize.sync();

export default db;
