import { Sequelize } from "sequelize";
import PompaAirBaku from "../models/pompa_air_baku.js";

export const findAll = async (req, res) => {
    try {
        const result = await PompaAirBaku.findAll({
            order: [['timestamp', 'DESC']]
        });
        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan data',
            instance: 'PompaAirBaku-findAll',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { pompa_operasi, frekuensi_inverter, ampere_meter, output_power, pressure_gauge, timestamp } = req.body;
    try {

        const validateMachine = ['PU 101 A', 'PU 101 B', 'PU 101 C']
        if (!validateMachine.includes(pompa_operasi)) {
            return res.status(400).json({
                error: 'Jenis pompa mesin tidak valid',
            });
        }

        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                error: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await PompaAirBaku.findOne({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('timestamp')), '=', inputTime.toISOString().split('T')[0]), // Mengecek hari yang sama
                    Sequelize.where(Sequelize.fn('HOUR', Sequelize.col('timestamp')), '=', inputTime.getUTCHours()) // Mengecek jam yang sama
                ]
            }
        });

        if (duplicateRecord) {
            return res.status(400).json({ error: 'Laporan untuk hari dan jam ini sudah ada' });
        }

        const lastRecord = await PompaAirBaku.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                error: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }

        const newRecord = await PompaAirBaku.create({
            pompa_operasi,
            frekuensi_inverter,
            ampere_meter,
            output_power,
            pressure_gauge,
            timestamp: timestamp || new Date(),
        });

        return res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'PompaAirBaku-create',
            error: error,
            errorMessage: error.message
        });
    }
}