import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const PreChlorine = DB.define("PreChlorine", {
    chlorinator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "PreChlorine",
    timestamps: false
})

export default PreChlorine