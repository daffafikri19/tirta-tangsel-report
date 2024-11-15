import { Sequelize } from "sequelize";
import FlowmeterAirFilter from "../models/flowmeter_air_filter.js";

export const findAll = async (req, res) => {
    try {
        const result = await FlowmeterAirFilter.findAll({
            order: [['timestamp', 'DESC']]
        });
        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan data',
            instance: 'FlowmeterAirFilter-findAll',
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

        const duplicateRecord = await FlowmeterAirFilter.findOne({
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

        const lastRecord = await FlowmeterAirFilter.findOne({
            order: [['timestamp', 'DESC']]
        });

        
        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }

        if (!lastRecord) {
            const newRecord = await FlowmeterAirFilter.create({
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

        const previousRecord = await FlowmeterAirFilter.findOne({
            where: {
                timestamp: {
                    [Sequelize.Op.lte]: new Date(inputTime - 2 * 60 * 60 * 1000),
                },
            },
            order: [['timestamp', 'DESC']],
        });

        if (!previousRecord) {
            return res.status(400).json({
                message: 'Data sebelumnya (parameter A) tidak ditemukan dalam rentang waktu yang diharapkan',
            });
        }

        const parameterA = previousRecord.parameterB || 0;
        const parameterG = inputTime;

        const timeDifferenceHours = (parameterG - previousRecord.timestamp) / 3600000; // (F - G)
        const C = (parameterB - parameterA) / timeDifferenceHours;
        const D = (C * 1000) / (60 * 60 * timeDifferenceHours);

        const newRecord = await FlowmeterAirFilter.create({
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
            instance: 'FlowmeterAirFilter-create',
            error: error,
            errorMessage: error.message
        });
    }
}