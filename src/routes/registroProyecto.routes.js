import { Router } from 'express';
import multer from "multer";
const upload = multer({ dest: 'public/uploads/' });
import {
  regProyectoAdd,
  regProyectoAddAll,
  regProyectoAll,
  regProyectoBlockDelete,
  regProyectoDelete,
  regProyectoOne,
  regProyectoUpdate,
  regProyectoOneByName,
  proyectoAll
} from '../controllers/registroProyecto.controller.js';
import { validarJWT, haveRol } from '../middleware/index.js';
const router = Router();

router.get('/regProyecto',validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), regProyectoAll);
router.get('/regProyectoAll',validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), proyectoAll);
router.get('/regProyecto/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), regProyectoOne);
router.get('/regProyectos/:proyecto', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), regProyectoOneByName);
router.post('/regProyecto', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), regProyectoAdd);
router.post('/regProyectoAddAll', upload.single('file'), regProyectoAddAll);
router.put('/regProyecto/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), regProyectoUpdate);
router.delete('/regProyecto/:id', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), regProyectoDelete);
router.delete('/regProyectoBloque', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'), regProyectoBlockDelete);

export default router;
