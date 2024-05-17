import { Router } from 'express';
import {
  uploadFile,
  bulkUpload,
  getFileUrl,
  getFilesUrl
} from '../controllers/filesManagement.controller.js';
import { validarJWT, checkFolderId, checkFilesBody, checkFilesBodyBulk } from '../middleware/index.js';

const router = Router();

router.post('/:folderId/upload', validarJWT, checkFolderId, checkFilesBody, uploadFile);
router.post('/:folderId/bulk-upload', validarJWT, checkFolderId, checkFilesBodyBulk, bulkUpload);

router.get('/get-file-url/*', getFileUrl);
router.get('/get-files', getFilesUrl);

export default router;
