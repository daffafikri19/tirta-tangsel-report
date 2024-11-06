import { DataTypes } from "sequelize";
import { DB } from "../config.js";

// TABEL + MODEL FLOWMETER AIR BAKU
const FlowmeterAirBakuModel= DB.define('FlowmeterRecord', {
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
    tableName: 'flowmeter_air_baku', // Nama tabel di database
    timestamps: false, // Nonaktifkan timestamps otomatis
});

export default FlowmeterAirBakuModel