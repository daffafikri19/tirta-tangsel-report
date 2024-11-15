import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const FlowmeterAirFilter = DB.define('FlowmeterAirFilter', {
    parameterA: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parameterB: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parameterF: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    parameterG: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    resultC: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    resultD: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'flowmeter_air_filter',
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default FlowmeterAirFilter