import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const FlowmeterAirReservoir = DB.define('FlowmeterAirReservoir', {
    parameterA: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    parameterB: {
        type: DataTypes.FLOAT,
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
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    resultD: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'flowmeter_air_reservoir',
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default FlowmeterAirReservoir