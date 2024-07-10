import { UserGroup } from '../../models/index.js'

const checkUsergrupId = async (req, res, next) => {

  if (req.params.usergroupId === undefined || req.params.usergroupId === '') {
    return res.status(400).send({ message: 'El ID del usergroup es requerido' })
  }

  const usergroup = await UserGroup.findByPk(req.params.usergroupId);
  if (!usergroup) {
    return res.status(404).send({ message: 'El usergroup no fue encontrado' })
  }

  req.usergroup = usergroup;

  next()
};

export { checkUsergrupId }
