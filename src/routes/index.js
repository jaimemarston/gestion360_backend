// <<<<<<< Updated upstream
 // import userRoutes from './user.routes.js';
 // import authLogin from './auth.routes.js';
 // import minioRoutes from './minio.routes.js';
 // import registroEmpleado from './registroEmpleado.routes.js';
// =======
 // import userRoutes from './user.routes.js';
 // import authLogin from './auth.routes.js';
 // import registroEmpleado from './registroEmpleado.routes.js';
import userRoutes from './user.routes.js';
import authLogin from './auth.routes.js';
import minioRoutes from './minio.routes.js';
import registroEmpleado from './registroEmpleado.routes.js';
import solicitudRoutes from './solicitud.routes.js';
import solicitudProductoRoutes from './solicitudProducto.routes.js';
import rendicionGastos from './rendicionGastos.routes.js';
import rendicionGastosProducto from './rendicionGastosProductos.routes.js';
import registroActividad from './registroActividad.routes.js';
import registroProyecto from './registroProyecto.routes.js';
import registroCargo from './registroCargo.router.js';
import registroDocumento from './registroDocumento.routes.js';
import lugarComision from './lugarComision.routes.js';
import registroCodigosReferencia from "./registroCodigosReferencia.routes.js";
import registroPresupuestoFinanciero from "./registroPresupuestoFinanciero.routes.js";
import registroPresupuesto from "./registroPresupuesto.routes.js";
import registroTipoDocumento from "./registroTipoDocumento.routes.js";
import user from "./user.routes.js";
import groupsRoutes from "./groups.routes.js";
import foldersRoute from "./folders.routes.js";

export {
  solicitudRoutes,
  registroEmpleado,
  solicitudProductoRoutes,
  userRoutes,
  authLogin,
  registroActividad,
  lugarComision,
  registroDocumento,
  registroProyecto,
  registroCargo,
  rendicionGastos,
  rendicionGastosProducto,
  registroCodigosReferencia,
  registroPresupuestoFinanciero,
  registroTipoDocumento,
  registroPresupuesto,
  minioRoutes,
  groupsRoutes,
  foldersRoute
};
