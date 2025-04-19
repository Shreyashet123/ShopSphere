const express=require('express');
const multer=require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier=require('streamifier');

require('dotenv').config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const storage=multer.memoryStorage();
const upload=multer({storage});

const router=express.Router();

router.post('/', upload.single('image'), async (req, res) => {
    console.log("File received:", req.file);  // Debugging

    if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
    }

    try {
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Upload Error:", error);
                            return reject(error);
                        }
                        resolve(result);
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);
        res.json({ imageUrl: result.secure_url });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Error uploading image" });
    }
});


module.exports=router;

