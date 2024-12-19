const express = require('express');
const multer = require('multer');
const { add, MoveImage, remove } = require('../controllers/ContrImage');
const { getById, getByTags } = require('../controllers/ViewImage');
const { tokenUser } = require('../middlewares/index');



const app = express();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.post('/add', tokenUser, upload.single('image'), add);
router.post('/remove/:id', remove);
router.post('/move/:id/:folder', MoveImage);
router.get('/image/:id', getById);
router.get('/images', getByTags);




module.exports = router;
