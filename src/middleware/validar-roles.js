import { request, response } from 'express';

// TODO para validar un rol en especifico
const validarRoles = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Se quiere verificar el role sin validar el token primero',
    });
  }

  const { rol } = req.usuario;
  if (rol !== 'ADMIN_ROLE') {
    return res
      .status(401)
      .json({ msg: 'No tiene permiso para realizar esta acción' });
  }
  next();
};
// TODO para validar un roles es especifico
const haveRol = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere verificar el role sin validar el token primero',
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res
        .status(401)
        .json({ msg: `El servicio require uno de estos roles => ${roles}` });
    }
    next();
  };
};

export { validarRoles, haveRol };
