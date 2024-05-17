import { Router } from 'express';
import {
  regActividadAdd,
  regActividadAll,
  regActividadBlockDelete,
  regActividadDelete,
  regActividadOne,
  regActividadUpdate,
} from '../controllers/registroActividad.controller.js';
import { validarJWT, haveRol } from '../middleware/index.js';
const router = Router();

router.get('/regActividad', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   regActividadAll);
router.get('/regActividad/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   regActividadOne);
router.post('/regActividad', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   regActividadAdd);
router.put('/regActividad/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   regActividadUpdate);
router.delete('/regActividad/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   regActividadDelete);
router.delete('/regActividadBloque', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   regActividadBlockDelete);

export default router;
