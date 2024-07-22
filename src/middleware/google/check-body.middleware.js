const checkGoogleBody = (req, res, next) => {

  if (!req.body.email) {
    return res.status(400).send({ message: 'El email es requerido' });
  }

  next();
}

export {
  checkGoogleBody
}
