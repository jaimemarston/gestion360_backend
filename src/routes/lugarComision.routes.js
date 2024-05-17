import { Router } from 'express';
import {
  comisionAdd,
  comisionAddAll,
  comisionAll,
  comisionBlockDelete,
  comisionDelete,
  comisionOne,
  comisionUpdate,
  comision
} from '../controllers/lugarComision.controller.js';
import { validarJWT, haveRol } from '../middleware/index.js';
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'public/uploads/' });

router.get('/comision', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  comisionAll);
router.get('/comisionAll', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  comision);
router.get('/comision/:id',validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   comisionOne);
router.post('/comision', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  comisionAdd);
router.post('/comisionAddAll', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  upload.single('file'), comisionAddAll);
router.put('/comision/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  comisionUpdate);
router.delete('/comision/:id',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  comisionDelete);
router.delete('/comisionBloque',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  comisionBlockDelete);

export default router;
