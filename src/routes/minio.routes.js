import { Router } from 'express';
import {
  uploadFile,
  bulkUpload,
  getFilesByFolder,
  deleteFile,
  getFileUrl,
} from '../controllers/filesManagement.controller.js';
import { 
  validarJWT,
  checkFolderId,
  checkFilesBody,
  checkFilesBodyBulk,
  ownerOrAsociated,
  checkFileId,
  fileOwnerOrFolderOwner,
  checkFilesOnlyFolder,
} from '../middleware/index.js';

const router = Router();

router.post('/:folderId/upload', validarJWT, checkFolderId, ownerOrAsociated, checkFilesBody, checkFilesOnlyFolder, uploadFile);
router.post('/:folderId/bulk-upload', validarJWT, checkFolderId, ownerOrAsociated, checkFilesBodyBulk, checkFilesOnlyFolder, bulkUpload);

router.delete('/:folderId/:fileId', [ validarJWT, checkFolderId, checkFileId, ownerOrAsociated, fileOwnerOrFolderOwner ], deleteFile);


router.get('/get-file-url/*', getFileUrl);
// router.get('/get-files', getFilesUrl);

router.get('/get-files-by-folder/:folderId', validarJWT, checkFolderId, ownerOrAsociated, getFilesByFolder);


export default router;
