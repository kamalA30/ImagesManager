const dbConnect = require('../configurations/db');
const createError = require('http-errors');

const { ObjectId } = require('mongodb');

const getById = async (req, res, next) => {
    try {
        dbConnect('patchar', async (db) => {
            const imageId = req.params.id;

            if (!ObjectId.isValid(imageId)) {
                return res.status(400).send('Invalid image ID format');
            }

            const image = await db.findOne({ _id: new ObjectId(imageId) });

            if (!image) {
                return res.status(404).send('Image not found');
            }

            res.contentType(image.img.contentType);
            res.send(image.img.data);
        });
    } catch (err) {
        next(createError(500, 'Error retrieving image'));
    }
};


const getByTags = async (req, res, next) => {
    try {
        dbConnect('patchar', async (db) => {
            const tags = req.query.tags ? req.query.tags.split(',') : [];

            const pipeline = [
                {
                    $match: tags.length ? { tags: { $in: tags } } : {}
                }
            ];

            const img = await db.aggregate(pipeline).toArray();

            res.status(200).json({
                status: true,
                img: img
            });
        })


    } catch (err) {
        next(createError(500, 'Error retrieving images'));
    }
};


module.exports = { getById, getByTags };
