import { Router } from 'express';
import {
  solicitudProductoAdd,
  solicitudProductoAll,
  solicitudProductoDelete,
  solicitudProductoUpdate
} from '../controllers/solicitudProducto.controllers.js';
import { validarJWT, haveRol } from '../middleware/index.js';
const router = Router();

router.get('/solicitudProducto', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudProductoAll);

router.post('/solicitudProducto', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudProductoAdd);


router.put('/solicitudProducto/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudProductoUpdate);

router.delete('/solicitudProducto/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),  solicitudProductoDelete);

export default router;
