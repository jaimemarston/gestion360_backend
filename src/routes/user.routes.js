import { Router } from 'express';

import {
  userAdd,
  userAll,
  userDelete,
  userOne,
  userUpdate,
  userCreate,
  updatePassword
} from '../controllers/user.controllers.js';
 import { validarJWT, haveRol } from '../middleware/index.js';

const router = Router();

router.get('/usuario', validarJWT, haveRol('ADMIN_ROLE'), userAll);

router.get('/usuario/create',  userCreate);


router.get('/usuario/:id', validarJWT,  haveRol('ADMIN_ROLE', 'USER_ROLE', 'RESPONSABLE_ROLE'), userOne);

router.post('/usuario',  userAdd);

router.patch('/usuario/:id', validarJWT,  haveRol('ADMIN_ROLE', 'USER_ROLE',), userUpdate);

router.put('/updatePassword', validarJWT,  haveRol('ADMIN_ROLE', 'USER_ROLE',), updatePassword);

router.delete(
  '/usuario/:id',
  haveRol('ADMIN_ROLE'),
  userDelete
);

export default router;
