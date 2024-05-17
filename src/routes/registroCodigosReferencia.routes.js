import { Router } from 'express';
import {
  referenciaAll,
  referenciaAddAll,
  referenciaAdd,referenciaDelete,
  referenciaUpdate,
  referencia,
  referenciaOne,
  referenciaOneCode,
  referenciaOneRuc
} from '../controllers/registroReferenciaCargo.controller.js';
import { validarJWT } from '../middleware/validar-jwt.js';
import { haveRol } from '../middleware/validar-roles.js';
import multer from "multer";
const upload = multer({ dest: 'public/uploads/' });
const router = Router();

router.get('/registroReferenciaAll', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),    referenciaAll);
router.get('/registroReferenciaAll/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),    referenciaOne);
/* router.get('/registroReferencia/:codigo', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),    referenciaOneCode); */
router.get('/registroReferencia/:ruc', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),    referenciaOneRuc);
router.get('/registroReferencia', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),    referencia);
router.post('/registroReferenciaAddAll', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   upload.single('file'), referenciaAddAll);

router.post('/registroReferencia',validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   referenciaAdd)


router.put('/registroReferenciaAll/:id',validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   referenciaUpdate);

router.delete('/registroReferencia/:id',validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   referenciaDelete)


export default router;
