import sequelize from "../configs/dbconnection.js";
import { DataTypes } from "sequelize";

const Suggestion = sequelize.define("Suggestion", {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  reason: DataTypes.STRING,
});

export default Suggestion;
