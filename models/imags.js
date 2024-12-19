const dbConnect = require('../configurations/db');
const { ObjectId } = require("bson");

class Images {

    constructor(dataImage) {
        this.dataImage = dataImage;
    }

    async save(cb) {
        dbConnect('patchar', async (db) => {
            try {
                const result = await db.insertOne(this.dataImage);
                cb({
                    status: true,
                    message: 'Image uploaded successfully'
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }

    Move(cb) {
        dbConnect('patchar', async (db) => {
            try {
                const { Id_image, folder } = this.dataImage;

                if (!Id_image || !folder) {
                    return cb({
                        status: false,
                        message: "Id_image and folder are required"
                    });
                }

                const _id = new ObjectId(Id_image);

                const result = await db.updateOne(
                    { _id: _id },
                    { $set: { folder: folder } },
                    { upsert: false }
                );

                cb({
                    status: true,
                    message: "Image moved successfully"
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }


    static remove(id, cb) {
        dbConnect('patchar', async (db) => {
            try {

                const _id = new ObjectId(id); 
                const result = await db.deleteOne({ _id: _id });
                if (!result) {
                    return cb({
                        status: false,
                        message: "Image not found"
                    });
                }

                cb({
                    status: true,
                    message: "Image deleted successfully"
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }


}

module.exports = Images;
