import { Sequelize } from "sequelize";
import FlowmeterAirBackwash from "../models/flowmeter_air_backwash.js";

export const findAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setUTCHours(23, 59, 59, 999); // Ubah endDate ke akhir hari
            dateFilter = {
                timestamp: {
                    [Op.between]: [start, end]
                }
            };
        }

        const { count, rows } = await FlowmeterAirBackwash.findAndCountAll({
            where: dateFilter,
            order: [['timestamp', 'DESC']],
            limit: limit,
            offset: offset
        });
        
        const totalPages = Math.ceil(count / limit);

        const response = {
            data: rows,
            pagination: {
                totalItems: count,
                currentPage: page,
                totalPages: totalPages,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan data',
            instance: 'FlowmeterAirBackwash-findAll',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { parameterB, timestamp } = req.body;

    try {
        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                message: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await FlowmeterAirBackwash.findOne({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('timestamp')), '=', inputTime.toISOString().split('T')[0]), // Mengecek hari yang sama
                    Sequelize.where(Sequelize.fn('HOUR', Sequelize.col('timestamp')), '=', inputTime.getUTCHours()) // Mengecek jam yang sama
                ]
            }
        });

        if (duplicateRecord) {
            return res.status(400).json({ message: 'Laporan untuk hari dan jam ini sudah ada' });
        }

        const lastRecord = await FlowmeterAirBackwash.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }
        
        if (!lastRecord) {
            const newRecord = await FlowmeterAirBackwash.create({
                parameterA: 0,
                parameterB,
                parameterF: null,
                parameterG: inputTime,
                resultC: null,
                resultD: null,
                timestamp: inputTime,
            });
            return res.status(201).json(newRecord);
        }

        const previousRecord = await FlowmeterAirBackwash.findOne({
            where: {
                timestamp: {
                    [Sequelize.Op.lte]: new Date(inputTime - 2 * 60 * 60 * 1000),
                },
            },
            order: [['timestamp', 'DESC']],
        });

        if (!previousRecord) {
            return res.status(400).json({
                message: 'Data sebelumnya tidak ditemukan dalam rentang waktu yang diharapkan',
            });
        }

        const parameterA = previousRecord.parameterB || 0;
        const parameterG = inputTime;

        const timeDifferenceHours = (parameterG - previousRecord.timestamp) / 3600000; // (F - G)
        const C = (parameterB - parameterA) / timeDifferenceHours;
        const D = (C * 1000) / (60 * 60 * timeDifferenceHours);

        const newRecord = await FlowmeterAirBackwash.create({
            parameterA,
            parameterB,
            parameterF: previousRecord.timestamp,
            parameterG,
            resultC: C,
            resultD: D,
            timestamp: parameterG,
        });

        return res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'FlowmeterAirBackwash-create',
            error: error,
            errorMessage: error.message
        });
    }
};