const multer = require('multer');

// ============================================================
// TIPOS DE IMAGEM PERMITIDOS
// ============================================================

const tiposPermitidos = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

// ============================================================
// CONFIGURAÇÃO DO UPLOAD
// ============================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!tiposPermitidos.includes(file.mimetype)) {
      return callback(
        new Error('Formato de imagem não permitido.')
      );
    }

    callback(null, true);
  },
});

function uploadFoto(req, res, next) {
  upload.single('foto')(req, res, (erro) => {
    if (erro) {
      return res.status(400).json({
        mensagem:
          erro.code === 'LIMIT_FILE_SIZE'
            ? 'A imagem deve ter no máximo 5 MB.'
            : erro.message,
      });
    }

    next();
  });
}

module.exports = { uploadFoto };