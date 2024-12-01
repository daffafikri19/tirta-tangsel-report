import { DataTypes } from "sequelize";
import { DB } from "../config.js";

const PostChlorine = DB.define("PostChlorine", {
    chlorinator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "PostChlorine",
    timestamps: false
})

export default PostChlorine