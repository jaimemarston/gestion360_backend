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
import { validarJWT,  checkBody, checkGroupId, checkFolderId, checkUserId, checkUsersId, checkUpdateBody} from '../middleware/index.js';
const router = Router();

router.get('/', validarJWT,  getAll);
router.get('/me', validarJWT, getUserFolders);
router.get('/:folderId', validarJWT, checkFolderId, getOne);
router.post('/', validarJWT, checkBody, checkGroupId,  create);
router.patch('/:folderId',  validarJWT, checkUpdateBody, checkFolderId, update);
router.delete('/:folderId', validarJWT, checkFolderId, remove);

router.post('/add-user/:folderId', validarJWT, checkFolderId, checkUsersId, addUserToFolder);
router.delete('/remove-user/:folderId/:userId', validarJWT, checkFolderId, checkUserId, removeUserToFolder);

export default router;
