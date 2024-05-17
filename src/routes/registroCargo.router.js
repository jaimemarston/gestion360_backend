import { Router } from 'express';
import {
  cargoAdd,
  cargoAddAll,
  cargoAll,
  cargoBlockDelete,
  cargoDelete,
  cargoOne,
  cargoUpdate,
} from '../controllers/registroCargo.controller.js';
import { validarJWT, haveRol } from '../middleware/index.js';
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'public/uploads/' });

router.get('/registroCargo', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   cargoAll);
router.get('/registroCargo/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   cargoOne);
router.post('/registroCargo', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   cargoAdd);
router.post('/registroCargoAddAll', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  upload.single('file'), cargoAddAll);
router.put('/registroCargo/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   cargoUpdate);
router.delete('/registroCargo/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   cargoDelete);
router.delete('/registroCargoBloque', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   cargoBlockDelete);

export default router;
