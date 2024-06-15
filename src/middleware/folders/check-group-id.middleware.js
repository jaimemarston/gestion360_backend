import { Groups } from '../../models/index.js'

const checkGroupId = async (req, res, next) => {

  if (req.body.parent !== undefined && req.body.parent !== null) {
    return next();
  }

  if (req.body.groupId === undefined || req.body.groupId === '') {
    return res.status(400).send({ message: 'El ID del groupo es requerido' })
  }

  const group = await Groups.findByPk(req.body.groupId);
  if (group === null) {
    return res.status(404).send({ message: 'Grupo no encontrado' })
  }

  req.group = group;

  next()
};

export { checkGroupId }
