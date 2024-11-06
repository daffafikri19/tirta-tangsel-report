import { Sequelize } from "sequelize";

export const DB = new Sequelize('tirta_tangsel', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});