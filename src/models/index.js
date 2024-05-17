
export { RendicionGastos } from './rendicionGastos.model.js';
export { RendicionGastosProducto } from './rendicionGastosProducto.model.js';
/* export { registroEmpleado} from './registroEmpleado.model.js' */
export { SolicitudProducto } from './solicitudProducto.model.js';
export { RegistroActividad } from './registroActividad.model.js';

export { RegistroCargo } from './registroCargo.model.js';
/* export { RegistroDocumento } from './registroDocumento.model.js'; */
export { LugarComision } from './lugarComision.model.js';
export { RegistroCodigoReferencia } from "./registroCodigoReferencia.model.js";
export { RegistroPresupuestoFinanciero } from './registroPresupuestoFInanciero.model.js';
export { registroPresupuesto } from './registroPresupuesto.model.js';
export { RegistroTipoDocumento } from './registroTipoDocumento.model.js'
export { Usuario } from './user.model.js';
import { registroEmpleado} from './registroEmpleado.model.js'
import { RegistroDocumento } from './registroDocumento.model.js';
import { Solicitud } from './solicitud.model.js';
import { RegistroProyecto } from './registroProyecto.model.js';
import { Groups } from './groups.mode.js';
import { Usuario } from './user.model.js';
import { Folders } from './folders.model.js';
import { MinioFiles } from './minioFiles.model.js';

RegistroProyecto.hasMany(Solicitud,  { onDelete: 'RESTRICT' }); 
Solicitud.belongsTo(RegistroProyecto);

registroEmpleado.hasMany(RegistroDocumento, { foreignKey: 'ndocumento' });
RegistroDocumento.belongsTo(registroEmpleado, { foreignKey: 'ndocumento' }); 

Usuario.hasMany(Groups);
Groups.belongsTo(Usuario); 

Folders.belongsTo(Groups);
Folders.belongsTo(Usuario);

MinioFiles.belongsTo(Folders);
MinioFiles.belongsTo(Usuario);

export { Folders } from './folders.model.js';
export { Groups } from './groups.mode.js';
export { registroEmpleado} from './registroEmpleado.model.js'
export { RegistroDocumento } from './registroDocumento.model.js';
export { Solicitud } from './solicitud.model.js';
// export { RegistroProyecto } from './registroProyecto.model.js';
export { RegistroProyecto } from './registroProyecto.model.js';
export { Categories } from './categories.model.js';
export { Subcategories } from './subcategories.model.js';
export { Sections } from './section.model.js';
export { MinioFiles } from './minioFiles.model.js';
