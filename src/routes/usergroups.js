import { Router } from 'express';
import {
  getAll,
  create,
  update,
  getOne
} from '../controllers/usergroups.controller.js';
import {
  validarJWT,
  checkUsergrupId,
  haveRol
} from '../middleware/index.js';
const router = Router();

router.get('/:usergroupId', validarJWT, checkUsergrupId, haveRol('ADMIN_ROLE'), getOne);
router.get('/', validarJWT, haveRol('ADMIN_ROLE'), getAll);
router.post('/', validarJWT, haveRol('ADMIN_ROLE'), create);
router.patch('/:usergroupId',  validarJWT, checkUsergrupId, haveRol('ADMIN_ROLE'), update);

export default router;
