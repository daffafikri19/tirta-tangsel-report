import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const BackwashFilterPasir = DB.define("BackwashFilterPasir", {
    filterNo: {
        type: DataTypes.ENUM("F-A1", "F-A2", "F-A3", "F-A4", "F-B1", "F-B2", "F-B3", "F-B4"),
        allowNull: false,
    },
    jamStart: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jamStop: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    airBlower: {
        type: DataTypes.ENUM("A", "B"),
        allowNull: false,
    },
    pompaBackwash: {
        type: DataTypes.ENUM("A", "B"),
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: "backwash_filter_pasir",
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default BackwashFilterPasir;