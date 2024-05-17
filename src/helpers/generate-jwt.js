import jwt from 'jsonwebtoken';

const generateJWT = (usuario) => {
  const { nombre, rol, id } = usuario;
  return new Promise((resolve, reject) => {
    const payload = { id, nombre, rol };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se genero el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

export { generateJWT };
