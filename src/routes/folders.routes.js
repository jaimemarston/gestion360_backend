import { Router } from 'express';
import {
  create,
  update,
  remove,
  getOne,
  getAll
} from '../controllers/folders.controller.js';
import { validarJWT,  checkBody, checkGroupId, checkFolderId} from '../middleware/index.js';
const router = Router();

router.get('/', validarJWT,  getAll);
router.get('/:folderId', validarJWT, checkFolderId, getOne);
router.post('/', validarJWT, checkBody, checkGroupId,  create);
router.patch('/:folderId',  validarJWT, checkBody, checkFolderId, update);
router.delete('/:folderId', validarJWT, checkFolderId, remove);

export default router;
