import { DataTypes } from 'sequelize';
import { DB } from "../config.js";

const TangkiKoagulanPAC = DB.define('TangkiKoagulanPAC', {
    stokOpname: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tinggiStok: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    konversiVolumeA: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    konversiVolumeB: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pemakaianPer2Jam: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'TangkiKoagulanPAC',
    timestamps: false
});

export default TangkiKoagulanPAC;
