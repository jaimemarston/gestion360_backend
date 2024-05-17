const checkBody = async (req, res, next) => {

  if (req.body.label1 === undefined || req.body.label1 === '' || typeof req.body.label1 !== 'string') {
    return res.status(400).send({ message: 'El label1 es requerido y debe ser una cadena' })
  }

  if (req.body.label2 !== undefined && (req.body.label2 === '' || typeof req.body.label2 !== 'string')) {
    return res.status(400).send({ message: 'Si se proporciona, label2 debe ser una cadena no vacía' })
  }

  if (req.body.label3 !== undefined && (req.body.label3 === '' || typeof req.body.label3 !== 'string')) {
    return res.status(400).send({ message: 'Si se proporciona, label3 debe ser una cadena no vacía' })
  }

  next()

};

export { checkBody }
