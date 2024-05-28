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
  groupsRoutes,
  foldersRoute
} from '../routes/index.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.prefix = '/api';
    this.connection();
    this.middleware();
  } 

  connection = async () => {
    try {
     // await sequelize.sync({ force: true, alter: true});
     
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
this.app.use(this.prefix, authLogin);
this.app.use(this.prefix, registroTipoDocumento);
this.app.use(this.prefix, registroEmpleado);
this.app.use(this.prefix, solicitudRoutes);
this.app.use(this.prefix, solicitudProductoRoutes);
this.app.use(this.prefix, rendicionGastos);
this.app.use(this.prefix, rendicionGastosProducto);
this.app.use(this.prefix, registroActividad);
this.app.use(this.prefix, registroProyecto);
this.app.use(this.prefix, registroCargo);
this.app.use(this.prefix, registroDocumento);
this.app.use(this.prefix, lugarComision);
this.app.use(this.prefix, registroCodigosReferencia);
this.app.use(this.prefix, userRoutes); 
this.app.use(this.prefix, registroPresupuestoFinanciero);
this.app.use(this.prefix, registroPresupuesto);
this.app.use(`${this.prefix}/minio`, minioRoutes)
this.app.use(`${this.prefix}/groups`, groupsRoutes)
this.app.use(`${this.prefix}/folders`, foldersRoute)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`========= <> Conectado al servidor <> =========`);

      console.log(`========= En el puerto =========`, this.port);
    });
  }
}

export default Server;
