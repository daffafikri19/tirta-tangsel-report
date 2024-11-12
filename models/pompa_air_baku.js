import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const PompaAirBaku = DB.define('PompaAirBaku', {
    pompa_operasi: {
        type: DataTypes.ENUM('PU 101 A', 'PU 101 B', 'PU 101 C'),
        allowNull: false,
    },
    frekuensi_inverter: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    ampere_meter: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    output_power: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    pressure_gauge: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'pompa_air_baku',
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default PompaAirBaku;
