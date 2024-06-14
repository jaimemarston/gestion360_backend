const checkUpdateBody = async (req, res, next) => {

  if (req.body.label1 !== undefined && (req.body.label1 === '' || typeof req.body.label1 !== 'string')) {
    return res.status(400).send({ message: 'Label 1 es requerido' })
  }

  if (req.body.label2 === '' || typeof req.body.label2 !== 'string') {
    req.body.label2 = null;
  }

  if (req.body.label3 === '' || typeof req.body.label3 !== 'string') {
    req.body.label3 = null;
  }

  next()

};

export { checkUpdateBody }
