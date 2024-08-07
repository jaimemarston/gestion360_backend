import { Router } from 'express';
import {
  create,
  update,
  remove,
  getOne,
  getAll,
  addUserToFolder,
  removeUserToFolder,
  getUserFolders,
} from '../controllers/folders.controller.js';
import {
  validarJWT,
  checkBody,
  checkGroupId,
  checkFolderId,
  checkUserId,
  checkUsersId,
  checkUpdateBody,
  checkParentFolder,
  haveRol
} from '../middleware/index.js';
const router = Router();

router.get('/', validarJWT,  getAll);
router.get('/me', validarJWT, getUserFolders);
router.get('/:folderId', validarJWT, checkFolderId, getOne);
router.post('/', validarJWT, checkBody, checkGroupId, checkParentFolder, create);
router.patch('/:folderId',  validarJWT, checkFolderId, checkUpdateBody, update);
router.delete('/:folderId', validarJWT, checkFolderId, remove);

router.post('/add-user/:folderId', validarJWT, checkFolderId,  addUserToFolder);
router.post('/remove-user/:folderId', validarJWT, checkFolderId, removeUserToFolder);

export default router;
