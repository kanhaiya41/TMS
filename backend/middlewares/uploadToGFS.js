import mongoose from "mongoose";
import { GridFSBucket } from 'mongodb';
import grid from 'gridfs-stream'
import multer from "multer";

let gridFsBucket, gfs;

mongoose.connection.once('open', () => {
    gridFsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'Profile'
    });
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('Profile');
});

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024, // ✅ 30 MB is a good sweet spot
    },
});

export const uploadToGridFs = (req, res, next) => {
    const { file } = req;

    if (!file) {
        next();
    }
    else {
        let filename = `${Date.now()}-file-${file.originalname}`;
        file.originalname = filename;

        const writstream = gridFsBucket.openUploadStream(file.originalname, {
            contentType: file.mimetype
        });

        writstream.end(file.buffer);

        writstream.on('finish', () => {
            req.file.id = writstream.id;
            next();
        });

        writstream.on('error', (err) => {
            return res.status(500).json({ error: err.message });
        });
    }
};

export const getProfilePic = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readstream = gridFsBucket.openDownloadStream(file._id);
        readstream.pipe(res);
    } catch (error) {
        console.log("error while getting image", error)
    }
}