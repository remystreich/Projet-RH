const multer = require('multer');
// Configuration de Multer pour spécifier où enregistrer les fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Indique le dossier de destination des fichiers
        cb(null, 'views/assets/img/uploads');
    },
    filename: (req, file, cb) => {
        // Génère un nom de fichier unique pour éviter les collisions
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({storage: storage});

module.exports = upload;