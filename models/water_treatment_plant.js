import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const WaterTreamentPlant = DB.define("WaterTreamentPlant", {
    operasional: {
        type: DataTypes.ENUM("WTP A", "WTP B", "WTP A&B"),
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: "WaterTreamentPlant",
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default WaterTreamentPlant;