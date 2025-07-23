import sequelize from "../configs/dbconnection.js";
import { DataTypes } from "sequelize";

const Task = await sequelize.define("Task", {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  deadline: DataTypes.DATE,
  suggested_time: DataTypes.DATE,
  is_complete: DataTypes.BOOLEAN,
  is_important: DataTypes.BOOLEAN,
});

export default Task;
