import { Router } from 'express';
import {
  lugarAdd,
  lugarAddAll,
  lugarAll,
  lugarBlockDelete,
  lugarDelete,
  lugarOne,
  lugarUpdate,
  addAllFirm,
  firmarDoc,
  uploadfile,
  getBoletasMay,
  setFirmas,
  descargarDocumentosPorIds
} from '../controllers/registroDocumento.controller.js';
import { validarJWT, haveRol } from '../middleware/index.js';
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const storageDocFirm = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {

    const verfie = file.originalname.split('_')
    const name = verfie[0] === 'firmado' ? '' : 'firmado_'
    cb(null, `${name}${file.originalname}` );
  },
});


const  storageFirm = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/firmas');
  },
  filename: function (req, file, cb) {
    const id = req.params.dni;
    const comp = file.originalname.split('.');
 
    const variable = comp[1].toLocaleLowerCase();
    const firmaImc = 'firma_';
    const firmaComp = `${firmaImc}${id}.${variable}`;

    file.originalname = firmaComp;
    file.filename = firmaComp;
    cb(null, file.originalname);
  },
});


const upload = multer({ storage: storage });
const uploadFirm = multer({ storage: storageFirm });
const uploadDocFirm = multer({storage: storageDocFirm})


router.get('/regdoc', validarJWT, haveRol('ADMIN_ROLE'), lugarAll);
router.get('/migration',  getBoletasMay);
router.get('/firmas',  setFirmas);
router.get('/regdoc/:id', validarJWT, haveRol('ADMIN_ROLE', 'USER_ROLE'), lugarOne);
router.post('/regdoc', validarJWT, haveRol('ADMIN_ROLE', 'USER_ROLE'), lugarAdd);
router.post('/regdocAddAll', upload.array('file'), lugarAddAll);
router.post('/regdocfirmAddAll', uploadDocFirm.array('file'), addAllFirm); 
router.post('/subir_firma/:dni', uploadFirm.single('image'), uploadfile);
router.post('/firmar_doc', validarJWT, haveRol('ADMIN_ROLE', 'USER_ROLE'), firmarDoc);
router.put('/regdoc/:id', validarJWT, haveRol('ADMIN_ROLE', 'USER_ROLE'), lugarUpdate);
router.delete('/regdoc/:id', validarJWT, haveRol('ADMIN_ROLE', 'USER_ROLE'), lugarDelete);
router.delete('/regdocBloque', validarJWT, haveRol('ADMIN_ROLE', 'USER_ROLE'), lugarBlockDelete);

router.post('/descargar-por-id',descargarDocumentosPorIds);

export default router;
