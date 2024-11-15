import { Sequelize } from "sequelize";
import WaterTreamentPlant from "../models/water_treatment_plant.js";

export const findAll = async (req, res) => {
    try {
        const result = await WaterTreamentPlant.findAll({
            order: [['timestamp', 'DESC']]
        })
        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan data',
            instance: 'WaterTreamentPlant-findAll',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { operasional, timestamp } = req.body;
    try {
        
        const validOperasional = ["WTP A", "WTP B", "WTP A&B"];
        if (!validOperasional.includes(operasional)) {
            return res.status(400).json({
                message: 'Tipe operasional tidak valid',
            });
        }

        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                message: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await WaterTreamentPlant.findOne({
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

        const lastRecord = await WaterTreamentPlant.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }

        const newWaterTreatmentPlant = await WaterTreamentPlant.create({
            operasional,
            timestamp: inputTime
        });
        return res.status(201).json(newWaterTreatmentPlant);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'WaterTreamentPlant-create',
            error: error,
            errorMessage: error.message
        });
    }
}