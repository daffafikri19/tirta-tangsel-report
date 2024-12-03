import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const FlowmeterAirFilterProduksi = DB.define('FlowmeterAirFilterProduksi', {
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
    tableName: 'flowmeter_air_filter_produksi',
    timestamps: false, // true : Jika ingin menggunakan createdAt dan updatedAt
});

export default FlowmeterAirFilterProduksi