import { Categories } from '../models/index.js';

async function findByName(name) {
  return await Categories.findOne({ where: { name } });
}

async function findById(id) {
  return await Categories.findByPk(id);
}

const getAllCategories = async (req, res) => {
  const categories = await Categories.findAll();
  res.status(200).json(categories);
}

const createCategory = async (req, res) => {

  if (req.body.name === '' || req.body.name === null || req.body.name === undefined) {
    return res.status(400).json({ message: 'El nombre es requerido' });
  }

  const category = await findByName(req.body.name);
  if (category) {
    return res.status(400).json({ message: 'La categoría ya existe' });
  }

  Categories.create({name: req.body.name})
  res.status(201).json({ message: 'Se ha creado con éxito' });
}

const findCategoryById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'El id es requerido' });
  }

  const category = await findById(req.params.id);
  if (!category) {
    return res.status(400).json({ message: 'La categoría no existe' });
  }

  res.status(200).json(category);
}

const deleteCategory = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'El id es requerido' });
  }

  const category = await findById(req.params.id);
  if (!category) {
    return res.status(400).json({ message: 'La categoría no existe' });
  }

  await category.destroy();
  res.status(200).json({ message: 'Se ha eliminado con éxito' });
}


const updateCategory = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'El id es requerido' });
  }

  const category = await Categories.findByPk(req.params.id);
  if (!category) {
    return res.status(400).json({ message: 'La categoría no existe' });
  }

  await category.update(req.body);

  res.status(200).json({ message: 'La categoría ha sido actualizada', category });
}

export {
  findCategoryById,
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategories
}
