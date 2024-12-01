import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const TangkiChlorine = DB.define("TangkiChlorine", {
    stokOpname: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tabungIsi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tabungKosong: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    realisasiDosisPre: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    realisasiDosisPost: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "TangkiChlorine",
    timestamps: false
})

export default TangkiChlorine