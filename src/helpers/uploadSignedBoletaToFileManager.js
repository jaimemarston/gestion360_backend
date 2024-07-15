import { RegistroDocumento, Usuario, registroEmpleado, Folders, Groups } from '../models/index.js';
import  MinioService from '../minio/minio.service.js';
const fileService = new MinioService();

const groupLabel = 'ADMINISTRATIVO PREDES';
const rootFolderLabel = '03. RECURSOS HUMANOS';
const subFolderLabel = '03.2 Boletas de sueldos, incluyendo el correo de conformidad';
const FOLDER = 'files';

const getMonthNameByBoletaName = async (filename) => {

  const regex = /(\d{4})(\d{2})\.pdf$/;

  const matches = filename.match(regex);

  if (matches) {
    const year = matches[1];
    const month = matches[2];
    const date = new Date(year, month - 1);

    const monthName = date.toLocaleString('es-ES', { month: 'long' });

    return monthName.toUpperCase()
  } else {
    return null
  }

}

const checkFolderStructureCreated = async (doc) => {

  let group = await Groups.findOne({ where: { name: groupLabel } });
  if (!group) {
    group = await Groups.create({ name: groupLabel });
  }
  group = group.toJSON();

  let rootFolder = await Folders.findOne({ where: { label: rootFolderLabel, GroupId: group.id, parent: null } });
  if (!rootFolder) {
    rootFolder = await Folders.create({ label: rootFolderLabel, GroupId: group.id, parent: null });
  }
  rootFolder = rootFolder.toJSON();

  let subFolder = await Folders.findOne({ where: { label: subFolderLabel, GroupId: group.id, parent: rootFolder.id } });
  if (!subFolder) {
    subFolder = await Folders.create({ label: subFolderLabel, GroupId: group.id, parent: rootFolder.id });
  }
  subFolder = subFolder.toJSON();

  const month = await getMonthNameByBoletaName(doc.nombredoc);
  if (month) {
    let monthFolder = await Folders.findOne({ where: { label: month, GroupId: group.id, parent: subFolder.id } });
    monthFolder = monthFolder
    ? monthFolder.toJSON()
    : await Folders.create({ label: month, GroupId: group.id, parent: subFolder.id });


    const documentBytes = await fileService.getFileBytes(`documents/${doc.nombredoc}`)
    const documentBase64 = documentBytes.toString('base64');

    const filename = `${monthFolder.id}/${doc.nombredoc}`;
    await fileService.saveBase64ToMinio(documentBase64, filename, FOLDER);
  }

}

export { checkFolderStructureCreated }
