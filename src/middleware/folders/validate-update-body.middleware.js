import { Folders } from '../../models/index.js'

const checkUpdateBody = async (req, res, next) => {

  if (req.body.label === undefined || (req.body.label === '' || typeof req.body.label !== 'string')) {
    return res.status(400).send({ message: 'El nombre es requerido' })
  }

  const siblingFolders = req.folder.parent ? 
    await Folders.findAll({ where: { parent: req.folder.parent } }) :
    await Folders.findAll({ where: { GroupId: req.folder.GroupId } });

  const nameAlreadyInUse = siblingFolders.find(folder => folder.dataValues.label.toLowerCase().trim() === req.body.label.toLowerCase().trim()) 

  if (nameAlreadyInUse) {
    return res.status(400).send({ message: 'Ya existe una carpeta con ese nombre' })
  }

  req.body.label = req.body.label.trim()
  next()

};

export { checkUpdateBody }
