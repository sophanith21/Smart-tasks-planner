import sequelize from "../configs/dbconnection.js";
import { DataTypes } from "sequelize";

const SuggestionDetail = sequelize.define(
  "SuggestionDetail",
  {
    suggested_time: DataTypes.DATE,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["TaskId", "SuggestionId"],
      },
    ],
  }
);

export default SuggestionDetail;
