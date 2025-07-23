import { DataTypes } from "sequelize";
import sequelize from "../configs/dbconnection.js";

const WeeklySchedule = sequelize.define(
  "WeeklySchedule",
  {},
  {
    timestamps: false,
  }
);

export default WeeklySchedule;
