import  MinioService from '../minio/minio.service.js';
import { v4 as uuidv4 } from 'uuid';
import {  MinioFiles } from '../models/index.js';
const fileService = new MinioService();

const FOLDER = 'files';

const formatObject = (object) => {

  if (object.error) {
    console.log('testrubg');
    return {
      filename: object.filename,
      error: object.error
    }
  }

  return {
    id: object.id,
    filename: object.filename,
    mimetype: object.mimetype,
    tags: object.tags,
    uuid: object.uuid,
    usuarioId: object.usuarioId,
    FolderId: object.FolderId,
    area: object.area,
    project: object.project,
    financial: object.financial,
    date: object.date,
    currency: object.currency,
    file_related: object.file_related,
  }
}

const uploadFile = async (req, res) => {

  try {

    const filename = `${req.folder.id}/${req.body.filename}`;
    const fileAlreadyExists = await fileService.fileExistsInMinio(filename, FOLDER);
    if (fileAlreadyExists) {
      return res.status(400).send({ message: 'El archivo ya existe' })
    }

    const uploaded = await fileService.saveBase64ToMinio(req.body.base64Content, filename, FOLDER);
    if (uploaded.error)
      return res.status(500).send({ message: uploaded.error })

    let uuid;
    let uuidExists;
    do {
      uuid = uuidv4();
      uuidExists = await MinioFiles.findOne({ where: { uuid } });
    } while (uuidExists);

    const file = await MinioFiles.create({
      filename: req.body.filename,
      mimetype: req.body.mimetype,
      tags: req.body.tags ? req.body.tags : [],
      uuid,
      usuarioId: req.usuario.id,
      FolderId: req.folder.id,
      area: req.body.area,
      project: req.body.project,
      financial: req.body.financial,
      date: req.body.date,
      currency: req.body.currency,
      file_related: req.body.file_related,
    })

    return res.send({ message: 'Archivo Subido', file: formatObject(file) })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

const bulkUpload = async (req, res) => {

  const files = req.body.files;
  const uploadedFiles = [];

  for (const object of files) {

    const filename = `${req.folder.id}/${object.filename}`;
    const fileAlreadyExists = await fileService.fileExistsInMinio(filename, FOLDER);
    if (fileAlreadyExists) {
      uploadedFiles.push({ filename: object.filename, error: 'el archivo ya existe' })
      continue;
    }

    const uploaded = await fileService.saveBase64ToMinio(object.base64Content, filename, FOLDER);
    if (uploaded.error) {
      uploadedFiles.push({ filename: object.filename, error: uploaded.error })
    } else {


      let uuid;
      let uuidExists;
      do {
        uuid = uuidv4();
        uuidExists = await MinioFiles.findOne({ where: { uuid } });
      } while (uuidExists);

      const file = await MinioFiles.create({
        filename: object.filename,
        mimetype: object.mimetype,
        tags: object.tags ? object.tags : [],
        uuid,
        usuarioId: req.usuario.id,
        FolderId: req.folder.id
      })

      uploadedFiles.push(formatObject(file));
    }

  }

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
  const url = await fileService.getFileUrl(`${name}`)
  res.send({ url })
}

const getFilesByFolder = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.per_page) || 10;
  const offset = (page - 1) * pageSize;

  const totalRecords = await MinioFiles.count({ where: { FolderId: req.folder.id } });
  const totalPages = Math.ceil(totalRecords / pageSize);

  const files = await MinioFiles.findAll({
    where: { FolderId: req.folder.id },
    limit: pageSize,
    offset: offset
  });

  const promises = files.map(async (file) => {
    const filename = `${req.folder.id}/${file.filename}`;
    const url = await fileService.getFileUrl(`${FOLDER}/${filename}`)

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

  const response = {
    data: formatted,
    totalPages,
    totalRecords,
    page: page,
    per_page: pageSize
  }

  return res.send({data: response})
}


const deleteFile = async (req, res) => {

  try {
    await req.file.destroy();
    return res.send({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: 'Ocurrio un error al intentar eliminar el archivo' });
  }

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
  getFilesByFolder,
  deleteFile
}
