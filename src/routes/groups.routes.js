import { Router } from 'express';
import {
  create,
  update,
  remove,
  getOne,
  getAll
} from '../controllers/groups.controller.js';
import { validarJWT, haveRol, checkName, checkId} from '../middleware/index.js';
const router = Router();

router.get('/', validarJWT, haveRol('ADMIN_ROLE'), getAll);
router.get('/:id', checkId, validarJWT, haveRol('ADMIN_ROLE'), getOne);
router.post('/', checkName, validarJWT, haveRol('ADMIN_ROLE'), create);
router.patch('/:id', checkName, validarJWT, haveRol('ADMIN_ROLE'), checkId, update);
router.delete('/:id', validarJWT, haveRol('ADMIN_ROLE'), checkId, remove);

export default router;
