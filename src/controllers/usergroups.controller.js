import { UserGroup } from '../models/user-group.model.js';

const parser = (group) => {
  return {
    id: group.id,
    name: group.name
  }
}

const getAll = async (req, res) => {
  return res.send('getAll')
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

export {
  getAll,
  create
}
