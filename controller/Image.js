const multer = require('multer')




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename : (req, file, cb) => {

        const filename = `${Date.now()}_${file.originalname.replace(/\s+/g, '-')}`

        cb(null, filename)

    },
})


const upload = multer({
    storage: storage

})



module.exports = upload

