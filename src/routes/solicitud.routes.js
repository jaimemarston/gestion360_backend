import { Router } from 'express';
import {
  solicitudAdd,
  solicitudAll,
  solicitudDelete,
  solicitudOne,
  solicitudUpdate,
  solicitudAllUser
} from '../controllers/solicitud.controllers.js';
import { validarJWT, haveRol } from '../middleware/index.js';
const router = Router();

router.get('/solicitud', validarJWT, haveRol('ADMIN_ROLE', 'RESPONSABLE_ROLE'),  solicitudAll);

router.get('/solicitud/user/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudAllUser);

router.get('/solicitud/:id', validarJWT, haveRol('ADMIN_ROLE', 'RESPONSABLE_ROLE'),  solicitudOne);

router.post('/solicitud', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudAdd);

router.put('/solicitud/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudUpdate);

router.delete('/solicitud/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudDelete);

export default router;
