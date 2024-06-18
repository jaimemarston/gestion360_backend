const checkFilesBody = (req, res, next) => {
    if (req.body.filename === undefined || req.body.filename === '') {
      return res.status(400).send({ message: 'El nombre de archivo es requerido' })
    }

    if (req.body.mimetype === undefined || req.body.mimetype === '') {
      return res.status(400).send({ message: 'El mimetype es requerido' })
    }

    if (req.body.base64Content === undefined || req.body.base64Content === '') {
      return res.status(400).send({ message: 'El contenido en base64 es requerido' })
    }

    if (req.body.title === undefined || req.body.title === '') {
      return res.status(400).send({ message: 'El titulo es requerido' })
    }

  req.body.filename = req.body.filename.trim()
  req.body.mimetype = req.body.mimetype.trim()
  req.body.title = req.body.title.trim()

  req.body.area = req.body?.area.trim() || null;
  req.body.project = req.body?.project.trim() || null;
  req.body.financial = req.body?.financial.trim() || null;
  req.body.date = req.body?.date.trim() || null;
  req.body.currency = req.body?.currency.trim() || null;
  req.body.file_related = req.body?.file_related.trim() || null;

  next()
}

export { checkFilesBody }
