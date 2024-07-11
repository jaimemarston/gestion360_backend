import { UserGroup, Usuario } from '../models/index.js';
import { Sequelize } from "sequelize";

const parser = async (group) => {
  return {
    id: group.id,
    name: group.name,
    usersAmount: await group.countUsers()
  }
}

const getOne = async (req, res) => {
  const group = await parser(req.usergroup)
  return res.status(200).send({data: group});
}

const getAll = async (req, res) => {
  const groups = await UserGroup.findAll();
  const parsedGroups = await Promise.all(groups.map(parser));
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
  return res.status(201).send({ message: 'Se ha creado con éxito', usergroup: await parser(group) });
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
  return res.status(200).send({ message: 'Se ha actualizado correctamente', usergroup: await parser(group) })
}

const addUsers = async (req, res) => {

  const { users: usersIds } = req.body;

  if (!usersIds || !Array.isArray(usersIds) || usersIds.length === 0) {
    return res.status(400).send({ message: 'Debe enviar un arreglo de usuarios' })
  }

  const users = await Usuario.findAll({ where: { id: { [Sequelize.Op.in]: usersIds } } });
  await req.usergroup.addUsers(users);

  return res.send({ message: 'Se han agregado los usuarios con éxito' })
}

const removeUsers = async (req, res) => {

  const { users: usersIds } = req.body;

  if (!usersIds || !Array.isArray(usersIds) || usersIds.length === 0) {
    return res.status(400).send({ message: 'Debe enviar un arreglo de usuarios' })
  }

  const users = await Usuario.findAll({ where: { id: { [Sequelize.Op.in]: usersIds } } });
  await req.usergroup.removeUsers(users);

  return res.send({ message: 'Se han eliminado los usuarios del grupo éxito' })
}

export {
  getAll,
  create,
  update,
  getOne,
  addUsers,
  removeUsers
}
