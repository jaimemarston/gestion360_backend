import  MinioService from '../minio/minio.service.js';
import {  MinioFiles } from '../models/index.js';
const fileService = new MinioService();

const FOLDER = 'files';

const formatObject = (object) => {
  return {
    id: object.id,
    filename: object.filename,
    mimetype: object.mimetype,
    tags: object.tags,
    usuarioId: object.usuarioId,
    FolderId: object.FolderId
  }
}

const uploadFile = async (req, res) => {

  try {

    const uploaded = await fileService.saveBase64ToMinio(req.body.base64Content, req.body.filename, FOLDER);
    if (uploaded.error)
      return res.status(500).send({ message: uploaded.error })

    const file = await MinioFiles.create({
      filename: req.body.filename,
      mimetype: req.body.mimetype,
      tags: req.body.tags ? req.body.tags : [],
      usuarioId: req.usuario.id,
      FolderId: req.folder.id
    })

    return res.send({ message: 'Archivo Subido', file: formatObject(file) })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

const bulkUpload = async (req, res) => {

  const files = req.body.files;
  const uploadedFiles = [];

  const promises = files.map(async (object) => {

    const uploaded = await fileService.saveBase64ToMinio(object.base64Content, object.filename, FOLDER);
    if (uploaded.error) {
      uploadedFiles.push({ filename: object.filename, error: uploaded.error })
    } else {
      const file = await MinioFiles.create({
        filename: object.filename,
        mimetype: object.mimetype,
        tags: object.tags ? object.tags : [],
        usuarioId: req.usuario.id,
        FolderId: req.folder.id
      })

      uploadedFiles.push(formatObject(file));
    }
  });

  await Promise.all(promises);

  const hasErrors = uploadedFiles.some((file) => file.error !== undefined)

  return hasErrors ? 
    res.status(500).send({ message: 'Algunos archivos no fueron subidos', files: uploadedFiles }) :
    res.send({ message: 'Archivos subidos', files: uploadedFiles })

}

const getFilesUrl = async (req, res) => {

  const urls = {}

  const promises = req.body.files.map(async (filename) => {
    const url = await fileService.getFileUrl(`${FOLDER}/${filename}`)
    urls[filename] = url;
  });

  await Promise.all(promises);

  res.send({ urls })
}

const getFileUrl = async (req, res) => {
  const name = req.params[0];
  // return res.send(name);
  const url = await fileService.getFileUrl(`${name}`)
  res.send({ url })
}

const getFilesByFolder = async (req, res) => {

  const urls = {};
  const files = await MinioFiles.findAll({ where: { FolderId: req.folder.id } });

  const promises = files.map(async (file) => {
    const url = await fileService.getFileUrl(`${FOLDER}/${file.filename}`)

    return {
      url,
      ...file
    }
  });

  const result = await Promise.all(promises);
  const formatted = result.map((object) => {

    return {
      id: object.dataValues.id,
      filename: object.dataValues.filename,
      mimetype: object.dataValues.mimetype,
      tags: object.dataValues.tags,
      url: object.url,
      createdAt: object.dataValues.createdAt,
      updatedAt: object.dataValues.updatedAt,
    }

  });

  return res.send({data: formatted})
}


// const getFileBytes = (filePath) => {
//   try {
//     // leer el archivo y devolver su contenido
//     const fileContent = fs.readFileSync(filePath);
//     return fileContent;
//   } catch (err) {
//     console.error(`Error al leer el archivo: ${err}`);
//     return null;
//   }
// }

export {
  uploadFile,
  bulkUpload,
  getFileUrl,
  getFilesUrl,
  getFilesByFolder
}
