import jwt from 'jsonwebtoken';
import { Usuario } from '../models/user.model.js';

const validarJWT = async (req, res, next) => {
  
  let token;

      if(req.headers['authorization']){
        token = req.headers['authorization'].split(' ')[1];
      } 


  if (!token) {
    return res.status(401).json({ message: 'No hay token en la petición' });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const usuario = await Usuario.findOne({
      where: { id },
    });

    if (!usuario) {
      return res.status(401).json({ message: 'El usuario no existe' });
    }

    if (!usuario.estado) {
      return res.status(401).json({ message: 'Token no valido' });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'No hay token en la petición' });
  }
};

export { validarJWT };
