import  MinioService from '../minio/minio.service.js';
import { v4 as uuidv4 } from 'uuid';
import { MinioFiles, Tag, TagFile } from '../models/index.js';
const fileService = new MinioService();

const FOLDER = 'files';

const formatObject = (object) => {
  return {
    id: object.id,
    filename: object.filename,
    mimetype: object.mimetype,
    uuid: object.uuid,
    usuarioId: object.usuarioId,
    FolderId: object.FolderId,
    metadata: {
      title: object.title,
      area: object.area,
      project: object.project,
      financial: object.financial,
      date: object.date,
      currency: object.currency,
      file_related: object.file_related,
      tags: object.fileTags?.map(tag => ({name: tag.name, id: tag.id})) || null
    }
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
      uuid,
      usuarioId: req.usuario.id,
      FolderId: req.folder.id,
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
    include: [
        {
            model: Tag,
            as: 'fileTags',
        },
    ],
    limit: pageSize,
    offset: offset
  });


  const promises = files.map(async (file) => {
    const filename = `${req.folder.id}/${file.filename}`;
    const url = await fileService.getFileUrl(`${FOLDER}/${filename}`)

    return {
      url,
      ...formatObject(file)
    }
  });

  const result = await Promise.all(promises);

  const response = {
    data: result,
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

const addFileMetadata = async (req, res) => {

  const data = {
    title: req.body.title?.trim() || null,
    area: req.body.area?.trim() || null,
    project: req.body.project?.trim() || null,
    financial: req.body.financial?.trim() || null,
    date: req.body.date?.trim() || null,
    currency: req.body.currency?.trim() || null,
    file_related: req.body.file_related?.trim() || null,
  }

  const file = await req.file.update(data);
  const fileTags = []

  if (req.body.tags && req.body.tags.length > 0){

    // Delete all tags from file and add new ones
    await TagFile.destroy({where: {fileId: file.id}});

    const promises = req.body.tags.map(async (tag) => {

      const tagObject = await findOrCreateTag(tag);
      await addTagToFile(file.toJSON(), tagObject);
      fileTags.push(tagObject);

    });

    await Promise.all(promises);
  }
  
  return res.send({ message: 'Metadata actualizada', file: {...formatObject({...file.toJSON(), fileTags})} })
}

async function findOrCreateTag(rawName) {
  const name = rawName.trim().toLowerCase().trim().replace(/\s/g, '-');
  const [tag, created] = await Tag.findOrCreate({
    where: {name},
    defaults: {name},
  });
  return tag.toJSON()
}

async function addTagToFile(file, tag) {
  const tagAlreadyAdded = await TagFile.findOne({
    where: {
      fileId: file.id,
      tagId: tag.id
    }
  });

  if (!tagAlreadyAdded) {
    await TagFile.create({
      fileId: file.id,
      minioFileId: file.id,
      tagId: tag.id
    });
  }
}

export {
  uploadFile,
  bulkUpload,
  getFileUrl,
  getFilesUrl,
  getFilesByFolder,
  deleteFile,
  addFileMetadata
}
