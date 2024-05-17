import { Router } from 'express';
import multer from "multer";
import { validarJWT, haveRol } from '../middleware/index.js';
import {addTipoDoc,getAllTipoDoc, deleteTipoDoc, getOneTipoDoc, getOneTipoDocName, addTipoDocOne, updateAllTipoDoc, getAll} from '../controllers/registroTipoDocumento.controllers.js'
const upload = multer({ dest: 'public/uploads/' });

const router = Router();

router.post('/registro-tipo-documento',  upload.single('file'), addTipoDoc );


router.post('/registro-tipo-documento/one', validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),      addTipoDocOne );

router.get('/tipo-documento',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   getAllTipoDoc );

router.get('/tipo-documentoAll',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   getAll );

router.put('/tipo-documento/:id',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   updateAllTipoDoc );


router.get('/tipo-documento/:id',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   getOneTipoDoc );


router.get('/tipo-documento/tipo/:tipo',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   getOneTipoDocName );

router.delete('/delete-tipo-documento/:id',  validarJWT, haveRol('ADMIN_ROLE','RESPONSABLE_ROLE'),   deleteTipoDoc );

export default router;
