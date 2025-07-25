import sequelize from "../configs/dbconnection.js";
import { DataTypes } from "sequelize";

const WeeklyScheduleDetails = sequelize.define(
  "WeeklyScheduleDetail",
  {
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
    },
    content: DataTypes.STRING,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["day", "time"],
      },
    ],
  }
);

export default WeeklyScheduleDetails;
