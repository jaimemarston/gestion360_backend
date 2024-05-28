import { Usuario } from '../../models/index.js'

const checkUserId = async (req, res, next) => {

  if (req.params.userId === undefined || req.params.userId === '') {
    return res.status(400).send({ message: 'El ID del usuario es requerido' })
  }

  const usuario = await Usuario.findByPk(req.params.userId);
  if (!usuario) {
    return res.status(404).send({ message: 'Usuario no encontrado' })
  }

  req.user = usuario;

  next()
};

export { checkUserId }
