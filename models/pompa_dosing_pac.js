import { DataTypes } from 'sequelize';
import { DB } from "../config.js"

const PompaDosingPAC = DB.define('PompaDosingPAC', {
    pompaDosing: {
        type: DataTypes.ENUM,
        values: ['DP 404 A', 'DP 404 B'],
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
    timestamps: false,
    tableName: 'PompaDosingPAC'
});

export default PompaDosingPAC;
