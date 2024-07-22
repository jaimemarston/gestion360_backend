import { Usuario } from '../models/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

const authenticateUser = async (req, res) => {
    const { body } = req;

    let usuario = await Usuario.findOne({
      where: { email: body.email },
    });

    if (!usuario) {
      return res.status(400).json({ message: 'El correo no existe' });
    }

    if (!usuario.estado) {
      return res
        .status(400)
        .json({ message: 'Hubo un error, hable con el administrador' });
    }

    usuario.password = null
    const user = {id: usuario.id}
    const token = await generateJWT(user);

    return res.status(200).json({ usuario, token });
}
 
export {
  authenticateUser
}
