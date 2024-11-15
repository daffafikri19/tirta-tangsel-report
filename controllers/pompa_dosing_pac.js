import { Sequelize } from "sequelize";
import PompaDosingPAC from "../models/pompa_dosing_pac.js";

export const findAll = async (req, res) => {
    try {
        const result = await PompaDosingPAC.findAll({
            order: [['timestamp', 'DESC']]
        })

        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'PompaDosingPAC-findAll',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { pompaDosing, strokePompa, realisasiDosis, timestamp } = req.body;

    try {
        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                message: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await PompaDosingPAC.findOne({
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

        const lastRecord = await PompaDosingPAC.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }

        const validPompaDosing = ["DP 404 A", "DP 404 B"];
        if (!validPompaDosing.includes(pompaDosing)) {
            return res.status(400).json({ error: "Tipe Pompa Dosing tidak valid" });
        }

        if (strokePompa < 0 || strokePompa > 100) {
            return res.status(400).json({
                error: "Nilai Stroke Pompa harus antara 0% dan 100%"
            });
        }

        const literPerJam = strokePompa * 330;

        const newRecord = await PompaDosingPAC.create({
            pompaDosing,
            strokePompa,
            literPerJam,
            realisasiDosis,
            timestamp: inputTime
        });

        return res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan saat menambahkan data",
            instance: "PompaDosingPAC-create",
            error: error.message
        });
    }
}