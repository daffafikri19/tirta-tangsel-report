import { DataTypes } from 'sequelize';
import { DB } from "../config.js"

const PompaDosingPAC = DB.define('PompaDosingPAC', {
    pompaDosing: {
        type: DataTypes.ENUM,
        values: ['DP 404 A', 'DP 404 B'],
        allowNull: false,
    },
    strokePompa: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    literPerJam: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    realisasiDosis: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'PompaDosingPAC'
});

export default PompaDosingPAC;
