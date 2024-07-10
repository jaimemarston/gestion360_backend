import { Router } from 'express';
import {
  getAll,
  create,
  update
} from '../controllers/usergroups.controller.js';
import {
  validarJWT,
  checkUsergrupId,
//   checkBody,
//   checkGroupId,
//   checkFolderId,
//   checkUserId,
//   checkUsersId,
//   checkUpdateBody,
//   checkParentFolder,
  haveRol
} from '../middleware/index.js';
const router = Router();

router.get('/', validarJWT, haveRol('ADMIN_ROLE'), getAll);
router.post('/', validarJWT, haveRol('ADMIN_ROLE'), create);
router.patch('/:usergroupId',  validarJWT, checkUsergrupId, haveRol('ADMIN_ROLE'), update);
// router.get('/me', validarJWT, getUserFolders);
// router.get('/:folderId', validarJWT, checkFolderId, getOne);
// router.post('/', validarJWT, checkBody, checkGroupId, checkParentFolder, haveRol('ADMIN_ROLE'), create);
// router.patch('/:folderId',  validarJWT, checkFolderId, checkUpdateBody, haveRol('ADMIN_ROLE'), update);
// router.delete('/:folderId', validarJWT, checkFolderId, remove);

// router.post('/add-user/:folderId', validarJWT, checkFolderId, checkUsersId, haveRol('ADMIN_ROLE'), addUserToFolder);
// router.delete('/remove-user/:folderId', validarJWT, checkFolderId, checkUsersId, haveRol('ADMIN_ROLE'), removeUserToFolder);

export default router;
