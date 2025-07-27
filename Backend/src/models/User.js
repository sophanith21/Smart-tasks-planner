import sequelize from "../configs/dbconnection.js";
import { DataTypes } from "sequelize";

const user = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },

  password: { type: DataTypes.STRING, allowNull: false },
});

export default user;
