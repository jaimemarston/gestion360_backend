import { Router } from 'express';
import {
  rendGastosAdd,
  rendGastosAll,
  rendGastosBlockDelete,
  rendGastosDelete,
  rendGastosOne,
  rendGastosUpdate,
} from '../controllers/rendicionGastos.controller.js';
import { validarJWT, haveRol } from '../middleware/index.js';
const router = Router();

router.get('/rendGastos', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   rendGastosAll);
router.get('/rendGastos/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   rendGastosOne);
router.post('/rendGastos', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   rendGastosAdd);
router.put('/rendGastos/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   rendGastosUpdate);
router.delete('/rendGastos/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   rendGastosDelete);
router.delete('/rendGastosBloque', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   rendGastosBlockDelete);

export default router;
