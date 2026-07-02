const multer = require('multer');
const path = require('path');

// guarda em memória (melhor pra processar direto)
const storage = multer.memoryStorage();

// filtra tipos de arquivo
const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Formato inválido. Use PDF ou CSV'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB (ajuste se quiser)
    }
});

module.exports = upload;