import { Groups, UserGroup } from '../../models/index.js'

const checkId = async (req, res, next) => {

  if (req.params.id === undefined || req.params.id === '') {
    return res.status(400).send({ message: 'El ID es requerido' })
  }

  const group = await Groups.findByPk(+req.params.id);
  if (!group) {
    return res.status(404).send({ message: 'Grupo no encontrado' })
  }

  req.group = group;
  next();
}

export { checkId };
