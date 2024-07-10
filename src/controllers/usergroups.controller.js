import { UserGroup } from '../models/user-group.model.js';
import { Sequelize } from "sequelize";

const parser = (group) => {
  return {
    id: group.id,
    name: group.name
  }
}

const getOne = async (req, res) => {
  const group = parser(req.usergroup)
  return res.status(200).send({data: group});
}

const getAll = async (req, res) => {
  const groups = await UserGroup.findAll();
  const parsedGroups = groups.map(parser);
  return res.status(200).send({data: parsedGroups});
}

const create = async (req, res) => {
  const { name } = req.body;

  if(! name ) {
    return res.status(400).send({ message: 'El nombre del grupo es requerido' })
  }

  const nameAlreadyInUse = await UserGroup.findOne({ where: { name } });
  if (nameAlreadyInUse) {
    return res.status(400).send({ message: 'El nombre ya está en uso' })
  }

  const group = await UserGroup.create({ name });
  return res.status(201).send({ message: 'Se ha creado con éxito', usergroup: parser(group) })
}

const update = async (req, res) => {
  const { name } = req.body;

  if(! name ) {
    return res.status(400).send({ message: 'El nombre del grupo es requerido' })
  }

  const nameAlreadyInUse = await UserGroup.findOne({ where: { name, id: { [Sequelize.Op.ne]: req.usergroup.id } } });
  if (nameAlreadyInUse) {
    return res.status(400).send({ message: 'El nombre ya está en uso' })
  }

  await UserGroup.update( { name }, { where: { id: req.usergroup.id } });
  const group = await UserGroup.findByPk(req.usergroup.id);
  return res.status(200).send({ message: 'Se ha actualizado correctamente', usergroup: parser(group) })
}

export {
  getAll,
  create,
  update,
  getOne
}
