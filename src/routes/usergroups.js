import { Router } from 'express';
import {
  getAll,
  create,
  update,
  getOne,
  addUsers,
  removeUsers
} from '../controllers/usergroups.controller.js';
import {
  validarJWT,
  checkUsergrupId,
  haveRol
} from '../middleware/index.js';
const router = Router();

router.get('/:usergroupId', validarJWT, checkUsergrupId, getOne);
router.get('/', validarJWT, getAll);
router.post('/', validarJWT, haveRol('ADMIN_ROLE'), create);
router.patch('/:usergroupId',  validarJWT, checkUsergrupId, haveRol('ADMIN_ROLE'), update);

router.post('/:usergroupId/addUsers', validarJWT, haveRol('ADMIN_ROLE'), checkUsergrupId, addUsers);
router.post('/:usergroupId/removeUsers', validarJWT, haveRol('ADMIN_ROLE'), checkUsergrupId, removeUsers);

export default router;
