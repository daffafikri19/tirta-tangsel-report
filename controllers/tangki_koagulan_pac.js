import { Sequelize } from "sequelize";
import TangkiKoagulanPAC from "../models/tangki_koagulan_pac.js";

export const findAll = async (req, res) => {
    try {
        const result = await TangkiKoagulanPAC.findAll({
            order: [['timestamp', 'DESC']]
        })

        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'TangkiKoagulanPAC-findAll',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { stokOpname, tinggiStok, konversiVolumeA, konversiVolumeB, timestamp } = req.body;
    try {
        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                message: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await TangkiKoagulanPAC.findOne({
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

        const lastRecord = await TangkiKoagulanPAC.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }


        const pemakaianPer2Jam = konversiVolumeA - konversiVolumeB;

        const newRecord = await TangkiKoagulanPAC.create({
            stokOpname,
            tinggiStok,
            konversiVolumeA,
            konversiVolumeB,
            pemakaianPer2Jam,
            timestamp: inputTime
        });
        
        return res.status(201).json(newRecord)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'TangkiKoagulanPAC-create',
            error: error,
            errorMessage: error.message
        });
    }
}