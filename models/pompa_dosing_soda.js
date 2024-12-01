import { DataTypes } from 'sequelize';
import { DB } from "../config.js"

const PompaDosingSoda = DB.define("PompaDosingSoda", {
    pompaDosing: {
        type: DataTypes.ENUM,
        values: ['DP A', 'DP B'],
        allowNull: false,
    },
    strokePompa: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    literPerJam: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    realisasiDosis: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "PompaDosingSoda",
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default PompaDosingSoda;