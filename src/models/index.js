
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
import { Groups } from './groups.model.js';
import { Usuario } from './user.model.js';
import { Folders } from './folders.model.js';
import { FoldersUsers } from './folders-users.model.js';
import { MinioFiles } from './minioFiles.model.js';
import { UserGroup } from './user-group.model.js';
import { User_Group } from './user-group-user.model.js';
import { Usergroup_Folder } from './user-group-folder.model.js';

import { Tag } from './tag.model.js';
import { TagFile } from './tag-file.model.js';

RegistroProyecto.hasMany(Solicitud,  { onDelete: 'RESTRICT' }); 
Solicitud.belongsTo(RegistroProyecto);

registroEmpleado.hasMany(RegistroDocumento, { foreignKey: 'ndocumento' });
RegistroDocumento.belongsTo(registroEmpleado, { foreignKey: 'ndocumento' }); 

Usuario.hasMany(Groups);
Groups.belongsTo(Usuario); 

Groups.hasMany(Folders, { as: 'folders' }); // Added line
Folders.belongsTo(Groups);
Folders.belongsTo(Usuario);
Folders.hasMany(MinioFiles, { as: 'documents' });
MinioFiles.belongsTo(Folders);
MinioFiles.belongsTo(Usuario);

Usuario.belongsToMany(Folders, { through: FoldersUsers });
Folders.belongsToMany(Usuario, { through: FoldersUsers });

Tag.belongsToMany(MinioFiles, { through: TagFile, as: 'files' });
MinioFiles.belongsToMany(Tag, { through: TagFile, as: 'fileTags' });

UserGroup.belongsToMany(Usuario, { through: User_Group, as: 'users' });
Usuario.belongsToMany(Groups, { through: User_Group, as: 'groups' });

UserGroup.belongsToMany(Folders, { through: Usergroup_Folder, as: 'folders' });
Folders.belongsToMany(UserGroup, { through: Usergroup_Folder, as: 'usergroups' });

export { UserGroup } from './user-group.model.js';
export { Tag } from './tag.model.js';
export { TagFile } from './tag-file.model.js';

export { FoldersUsers } from './folders-users.model.js';
export { Folders } from './folders.model.js';
export { Groups } from './groups.model.js';
export { registroEmpleado} from './registroEmpleado.model.js'
export { RegistroDocumento } from './registroDocumento.model.js';
export { Solicitud } from './solicitud.model.js';
// export { RegistroProyecto } from './registroProyecto.model.js';
export { RegistroProyecto } from './registroProyecto.model.js';
export { Sections } from './section.model.js';
export { MinioFiles } from './minioFiles.model.js';
