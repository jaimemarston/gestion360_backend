import { Usuario } from '../../models/index.js'
import { Sequelize } from "sequelize";

const checkUsersId = async (req, res, next) => {

  if (req.body.user_ids === undefined || !Array.isArray(req.body.user_ids) || req.body.user_ids.length === 0) {
    return res.status(400).send({ message: 'Los ids de los usuarios es requerido' })
  }

  const usuarios = await Usuario.findAll({
    where: {
      id: {
        [Sequelize.Op.in]: req.body.user_ids
      }
    }
  });

  req.usuarios = usuarios;

  next()
};

export { checkUsersId }
