import { Folders } from '../../models/index.js'

const checkBody = async (req, res, next) => {

  if (req.body.label === undefined || req.body.label === '' || typeof req.body.label !== 'string') {
    return res.status(400).send({ message: 'El label es requerido y debe ser una cadena' })
  }

  const siblingFolders = req.body.parent ? 
    await Folders.findAll({ where: { parent: req.body.parent } }) :
    await Folders.findAll({ where: { GroupId: req.body.groupId } });

  const nameAlreadyInUse = siblingFolders.find(folder => folder.dataValues.label.toLowerCase().trim() === req.body.label.toLowerCase().trim()) 

  if (nameAlreadyInUse) {
    return res.status(400).send({ message: 'Ya existe una carpeta con ese nombre' })
  }

  req.body.label = req.body.label.trim()
  next()
};

export { checkBody }
