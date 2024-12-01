import { Sequelize } from "sequelize";
import TangkiChlorine from "../models/tangki_chlorine.js";

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

        const { count, rows } = await TangkiChlorine.findAndCountAll({
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
            instance: 'TangkiChlorine-findAll',
            error: error,
            errorMessage: error.message
        });
    }
}

export const create = async (req, res) => {
    const { stokOpname, tabungIsi, tabungKosong, realisasiDosisPre, realisasiDosisPost, timestamp } = req.body;
    try {
        const inputTime = new Date(timestamp);
        const inputHour = inputTime.getUTCHours();

        if (inputHour % 2 !== 0) {
            return res.status(400).json({
                message: 'Laporan tidak dapat dilakukan pada jam ini'
            });
        }

        const duplicateRecord = await TangkiChlorine.findOne({
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

        const lastRecord = await TangkiChlorine.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (lastRecord && inputTime <= lastRecord.timestamp) {
            return res.status(400).json({
                message: 'Laporan baru harus memiliki timestamp lebih besar dari laporan terakhir'
            });
        }

        const newRecord = await TangkiChlorine.create({
            stokOpname,
            tabungIsi, 
            tabungKosong,
            realisasiDosisPre,
            realisasiDosisPost,
            timestamp: inputTime
        })

        return res.status(201).json(newRecord)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan data',
            instance: 'TangkiChlorine-create',
            error: error,
            errorMessage: error.message
        });
    }
}