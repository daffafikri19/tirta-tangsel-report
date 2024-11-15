import { Sequelize } from "sequelize";
import Reservoir from "../models/reservoir.js";

export const findAll = async (req, res) => {
    try {
        const result = await Reservoir.findAll({
            order: [['timestamp', 'DESC']]
        })
        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan data',
            instance: 'Reservoir-findAll',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { kompartemen, levelReservoir, timestamp } = req.body;
    try {
        if (levelReservoir < 0 || levelReservoir > 100) {
            return res.status(400).json({
                message: 'Level Reservoir harus berada di antara 0% dan 100%',
            });
        }

        const validKompartemen = ["A", "B", "A&B"];
        if (!validKompartemen.includes(kompartemen)) {
            return res.status(400).json({
                message: 'nilai kompartemen tidak valid',
            });
        }

        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                message: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await Reservoir.findOne({
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

        const lastRecord = await Reservoir.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }

        const newReservoir = await Reservoir.create({
            kompartemen,
            levelReservoir,
            timestamp: inputTime
        });
        return res.status(201).json(newReservoir);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'Reservoir-create',
            error: error,
            errorMessage: error.message
        });
    }
}