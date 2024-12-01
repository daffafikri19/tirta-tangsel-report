import { Op, Sequelize } from "sequelize";
import BackwashFilterPasir from "../models/backwash_filter_pasir.js";

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

        const { count, rows } = await BackwashFilterPasir.findAndCountAll({
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
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'BackwashFilterPasir-create',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { filterNo, jamStart, jamStop, airBlower, pompaBackwash, timestamp } = req.body;

    try {
        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                message: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await BackwashFilterPasir.findOne({
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

        const lastRecord = await BackwashFilterPasir.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }

        const validFilterNos = ["F-A1", "F-A2", "F-A3", "F-A4", "F-B1", "F-B2", "F-B3", "F-B4"];
        if (!validFilterNos.includes(filterNo)) {
            return res.status(400).json({ message: "Nomor filter tidak valid" });
        }

        // Validasi pilihan airBlower dan pompaBackwash
        const validOptions = ["A", "B"];
        if (!validOptions.includes(airBlower)) {
            return res.status(400).json({ message: "Pilihan Air Blower tidak valid" });
        }

        if (!validOptions.includes(pompaBackwash)) {
            return res.status(400).json({ message: "Pilihan Pompa Backwash tidak valid" });
        }

        // Validasi jamStart dan jamStop
        if (jamStart >= jamStop) {
            return res.status(400).json({
                message: "Jam Start harus lebih awal dari Jam Stop"
            });
        }

        const newRecord = await BackwashFilterPasir.create({
            filterNo,
            jamStart,
            jamStop,
            airBlower,
            pompaBackwash,
            timestamp: inputTime
        });

        return res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan data',
            instance: 'BackwashFilterPasir-create',
            error: error,
            errorMessage: error.message
        });
    }
}