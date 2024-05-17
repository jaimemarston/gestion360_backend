import express from 'express';
import cors from 'cors';
import winston from 'winston';
import expressWinston from 'express-winston';
import { sequelize } from '../database/db.js';
import {
  solicitudProductoRoutes,
  solicitudRoutes,
  lugarComision,
  registroActividad,
  registroCargo,
  registroCodigosReferencia,
  registroDocumento,
  registroProyecto,
  rendicionGastos,
  rendicionGastosProducto,
  userRoutes,
  authLogin,
  registroEmpleado,
  registroPresupuestoFinanciero,
  registroTipoDocumento,
  registroPresupuesto,
  minioRoutes,
  categoriesRoute,
  groupsRoutes,
  foldersRoute
} from '../routes/index.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.connection();
    this.middleware();
  } 

  connection = async () => {
    try {
      // await sequelize.sync({ force: false, alter: false});
     
      await sequelize.authenticate();
      console.log(`========= <> Conectado la database <> =========`);
    
    } catch (error) {
      console.log(error);
    }
  };

  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
    }));

    this.routes();
  }

  routes() {
    this.app.use('/api', authLogin);
    this.app.use('/api', registroTipoDocumento);
    this.app.use('/api', registroEmpleado);
    this.app.use('/api', solicitudRoutes);
    this.app.use('/api', solicitudProductoRoutes);
    this.app.use('/api', rendicionGastos);
    this.app.use('/api', rendicionGastosProducto);
    this.app.use('/api', registroActividad);
    this.app.use('/api', registroProyecto);
    this.app.use('/api', registroCargo);
    this.app.use('/api', registroDocumento);
    this.app.use('/api', lugarComision);
    this.app.use('/api', registroCodigosReferencia);
    this.app.use('/api', userRoutes); 
    this.app.use('/api', registroPresupuestoFinanciero);
    this.app.use('/api', registroPresupuesto);
    this.app.use('/api/minio', minioRoutes)
    this.app.use('/api/categories', categoriesRoute)
    this.app.use('/api/groups', groupsRoutes)
    this.app.use('/api/folders', foldersRoute)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`========= <> Conectado al servidor <> =========`);

      console.log(`========= En el puerto =========`, this.port);
    });
  }
}

export default Server;
