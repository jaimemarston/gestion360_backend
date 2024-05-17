import { Groups } from '../models/index.js'

function formatObject(group) {
  return {
    id: group.id,
    name: group.name,
  }
}

async function findByName(name) {
  const group = await Groups.findOne({ where: { name } })
  return group
}

const getOne = async (req, res) => {
  return res.status(200).json( formatObject(req.group) )
}

const getAll = async (req, res) => {
  const query = await Groups.findAll();
  const groups = query.map(group => formatObject(group))
  return res.status(200).json( groups )
}

const create = async (req, res) => {

  const groupalreadtexists = await findByName(req.body.name);
  if (groupalreadtexists) {
    return res.status(400).send({ message: 'el grupo ya existe' })
  }

  const group = await Groups.create({ name: req.body.name, usuarioid: req.usuario.id })

  return res.status(201).send({ message: 'se ha creado con éxito', group: formatObject(group) })
}

const update = async (req, res) => {
  const nameAlreadyInUse = await findByName(req.body.name);
  if (nameAlreadyInUse && req.group.id !== nameAlreadyInUse.id) {
    return res.status(400).send({ message: 'El nombre ya está en uso' })
  }

  req.group.update(req.body)
  return res.status(200).send({ message: 'Se ha actualizado con éxito', group: formatObject(req.group) })
}

const remove = async (req, res) => {
  await req.group.destroy()
  return res.send({ message: 'Se ha eliminado con éxito' })
}

export {
  create,
  update,
  remove,
  getOne,
  getAll
}
