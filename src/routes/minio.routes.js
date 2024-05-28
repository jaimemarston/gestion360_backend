import { Router } from 'express';
import {
  uploadFile,
  bulkUpload,
  getFileUrl,
  getFilesUrl,
  getFilesByFolder,
} from '../controllers/filesManagement.controller.js';
import { validarJWT, checkFolderId, checkFilesBody, checkFilesBodyBulk, ownerOrAsociated} from '../middleware/index.js';

const router = Router();

router.post('/:folderId/upload', validarJWT, checkFolderId, ownerOrAsociated, checkFilesBody, uploadFile);
router.post('/:folderId/bulk-upload', validarJWT, checkFolderId, ownerOrAsociated, checkFilesBodyBulk, bulkUpload);

router.get('/get-file-url/*', getFileUrl);
router.get('/get-files', getFilesUrl);
router.get('/get-files-by-folder/:folderId', validarJWT, checkFolderId, getFilesByFolder);


export default router;
