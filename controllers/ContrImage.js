const { Image } = require('../models/index');
const createError = require('http-errors');
const { ObjectId } = require("bson");

const add = async (req, res, next) => {
    try {
        const schem = {
            _id_user: new ObjectId(req.body._id_user),
            name: req.body.name,
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
            tags: req.body.tags ? req.body.tags.split(',') : [],
            folder: req.body.folder
        }

        const newImage = new Image(schem);

        await newImage.save((status) => {
            if (!status.status) {
                res.status(400).json({
                    status: false,
                    message: "have err "
                });

            } else {
                res.status(200).json({
                    status: true,
                    message: " successfully",
                    schem: schem._id_user
                });
            }
        });

    } catch (err) {
        return next(createError(500, err.message));
    }
}


const MoveImage = async (req, res, next) => {
    try {

        const schema = {
            Id_image: new ObjectId(req.params.id),
            folder: req.params.folder
        };

        if (!schema.Id_image || !schema.folder) {
            return res.status(400).json({
                status: false,
                message: "Id_image and folder are required"
            });
        }

        const newImage = new Image(schema);

        newImage.Move((status) => {
            if (!status.status) {
                return res.status(400).json({
                    status: false,
                    message: status.message || "Error occurred while moving the image"
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Image moved successfully",
                    id_image: schema.Id_image
                });
            }
        });

    } catch (err) {
        return next(createError(500, err.message));
    }
};


const remove = async (req, res, next) => {
    try {
        const _id = req.params.id;

        if (!_id || !ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid _id format' });
        }

        Image.remove(_id, (status) => {
            if (!status.status) {
                return res.status(404).json({
                    status: false,
                    message: status.message || 'Error occurred while removing the image'
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Image has been removed successfully",
                    result: status.result
                });
            }
        });
    } catch (err) {
        return next(createError(500, err.message));
    }
};


module.exports = { add, MoveImage, remove };
