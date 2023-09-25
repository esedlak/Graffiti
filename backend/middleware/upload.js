const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

const storage = new GridFsStorage({
    url: process.env.DB_CONNECTION,
    options: { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME },
    file: (req, file) => {
        const match = ["image/png", "image/jpg", "image/jpeg"];

        if(match.indexOf(file.mimetype) === -1)
        {
            return `${Date.now()}-jf-${file.originalname}`;
        }
        
        return {
            bucketName: 'posts',
            filename: `${Date.now()}-jf-${file.originalname}`, 
            request: req
        }
    }
})

//Multer wird mit der GridFSStorage-Konfiguration initialisiert.
console.log('store', storage)

module.exports = multer({ storage });
