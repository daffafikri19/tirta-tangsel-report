import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const Reservoir = DB.define("Reservoir", {
    kompartemen: {
        type: DataTypes.ENUM("A", "B", "A&B"),
        allowNull: false,
    },
    levelReservoir: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100,
        },
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: "reservoir",
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default Reservoir;