import { Sequelize } from "sequelize";
import FlowmeterAirBakuModel from "../models/flowmeter_air_baku.js"

export const fetchData = async (req, res) => {
    try {
        const result = await FlowmeterAirBakuModel.findAll();
        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

export const recordData = async (req, res) => {
    const { parameterB, timestamp } = req.body; // Hanya parameter B dan timestamp sebagai input

    try {
        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        // Cek apakah waktu input sudah berada pada jam yang benar (genap setiap 2 jam)
        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                error: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        // Cek apakah sudah ada laporan di hari dan jam yang sama
        const duplicateRecord = await FlowmeterAirBakuModel.findOne({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('timestamp')), '=', inputTime.toISOString().split('T')[0]), // Mengecek hari yang sama
                    Sequelize.where(Sequelize.fn('HOUR', Sequelize.col('timestamp')), '=', inputTime.getUTCHours()) // Mengecek jam yang sama
                ]
            }
        });

        if (duplicateRecord) {
            return res.status(400).json({ error: 'Laporan untuk hari dan jam ini sudah ada.' });
        }

        // Ambil record terakhir berdasarkan timestamp
        const lastRecord = await FlowmeterAirBakuModel.findOne({
            order: [['timestamp', 'DESC']]
        });

        // Pastikan timestamp input lebih besar dari timestamp terakhir
        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                error: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir.'
            });
        }

        // Cari data dengan timestamp paling mendekati 2 jam sebelum waktu input sebagai parameter A
        const previousRecord = await FlowmeterAirBakuModel.findOne({
            where: {
                timestamp: {
                    [Sequelize.Op.lte]: new Date(inputTime - 2 * 60 * 60 * 1000), // 2 jam sebelum timestamp input
                },
            },
            order: [['timestamp', 'DESC']], // Mengambil record dengan timestamp terdekat sebelum 2 jam
        });

        // Pastikan ada record 2 jam sebelumnya untuk parameter A
        if (!previousRecord) {
            return res.status(400).json({
                error: 'Data sebelumnya (parameter A) tidak ditemukan dalam rentang waktu yang diharapkan.',
            });
        }

        // Set nilai A dan B
        const parameterA = previousRecord.parameterB; // Nilai A adalah parameterB dari previousRecord (2 jam sebelumnya)
        const parameterG = inputTime;

        // Hitung nilai C dan D berdasarkan parameter A dan B
        const timeDifferenceHours = (parameterG - previousRecord.timestamp) / 3600000; // Perbedaan waktu dalam jam
        const C = (parameterB - parameterA) / timeDifferenceHours; // Selisih nilai per jam
        const D = (C * 1000) / (60 * 60); // Konversi ke satuan detik

        // Buat record baru
        const newRecord = await FlowmeterAirBakuModel.create({
            parameterA,
            parameterB,
            parameterF: previousRecord.timestamp, // Menyimpan timestamp 2 jam sebelumnya
            parameterG,
            resultC: C,
            resultD: D,
            timestamp: parameterG,
        });

        return res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};