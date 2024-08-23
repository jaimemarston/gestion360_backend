## Despliegue

Todo el Backend esta `Dockerizado` al igual que la base de datos, tambien hay servicios para `minio` y `phpMyAdmin` no los recomiendo levantar para un entorno de produccion. Para desplegar usamos el plugin `compose` para los contenedores.

Para iniciar los servicios usamos el comando
```bash
docker compose up -d app db
```

Es importante decir que para que funcione el dominio estos contenedores hace falta iniciarlos dentro de la misma red de un reverse proxy, asi el reverse proxy puede reconocer el dominio y redireccionar el trafico al contenedor de la app

### Environment

Para levantar el backend hace falta estas variables de entorno dentro de un archivo `.env`

```env
PORT=8080

#CREDENCIALES DE LA BASE DE DATOS
POSTGRES_DB=predes
POSTGRES_USER=sail
POSTGRES_PASSWORD=password
POSTGRES_PORT=5433
POSTGRES_HOST=localhost
SECRETORPRIVATEKEY=mysecret

# Datos para el bucket S3 de AWS
MINIO_PORT=
MINIO_ENDPOINT=
MINIO_USE_SSL=
MINIO_USER=
MINIO_PASSWORD=
MINIO_BUCKET=
MINIO_REGION=

# Dominio para asignarle al backend
DOMAIN= 
```

## Insertar datos en la base de datos

Aqui voy a definir las un poco la estructura de carpetas, archivos y grupos. 

Primero se crean los `Groups`, se almacenan en la tabla `groups`, la unica referencia externa que tiene esta tabla es el id del usuario que creó este grupo.
```
INSERT INTO "Groups"
    ("uuid", "name", "createdAt", "updatedAt", "usuarioId") 
VALUES 
    ('24f21d21-96e1-4d33-b268-a80ef20deae4', 'GROUP NAME', '2024-07-02 21:55:15.06+00', '2024-07-24 13:54:33.476+00', 1);
```
Depues de los grupos estan las carpetas, existen carpetas root y carpetas hijas, las carpetas, todas las carpetas root dependen de un grupo 

```
INSERT INTO "Folders" ("id", "parent", "uuid", "label", "createdAt", "updatedAt", "GroupId", "usuarioId") VALUES
(83,	NULL,	'3356d743-f44f-48b2-ac87-b38a2c47366c',	'PrimerPadre',	'2024-07-24 21:03:00.137+00',	'2024-07-24 21:03:00.137+00',	22,	1), -- carpeta root
(84,	83,	'c30572e5-a45d-4b0e-87b2-c725b6f9f19e',	'PrimerHijo',	'2024-07-24 21:04:33.22+00',	'2024-07-24 21:04:33.22+00',	NULL,	1), -- carpeta hija
(85,	NULL,	'48b96c88-3fc9-4316-b293-c1420096047d',	'202401',	'2024-07-30 20:23:19.388+00',	'2024-07-30 20:23:19.388+00',	36,	1); -- carpeta root
```

Por ultimo tenemos los archivos, se guardan en la tabla `minioFiles`, aqui se guardan todos los archivos de la aplicacion, como boletas firmadas y no firmadas, al igual que los arhcivos del 
File Manager. Todos los archivos del File Manager dependen de un id de carpeta

```
INSERT INTO "minioFiles" ("id", "uuid", "filename", "mimetype", "tags", "title", "area", "project", "financial", "date", "currency", "file_related", "createdAt", "updatedAt", "FolderId", "usuarioId") VALUES
(70,	'9becd4f0-7c30-4723-911d-2662cf41d928',	'firmado_Boleta_06535086_202304.pdf',	'application/pdf',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-16 21:32:48.024+00',	'2024-07-16 21:32:48.024+00',	NULL,	NULL),
(68,	'c2b28204-65fa-4b12-8b80-754ba97c08e9',	'predes-background.png',	'image/png',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-08 16:01:30.518+00',	'2024-07-08 16:01:30.518+00',	NULL,	1),
(69,	'fe47b478-191e-4fc6-87ef-33134d22b862',	'Boleta_23985485_202405-1.pdf',	'application/pdf',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-15 12:51:37.818+00',	'2024-07-15 12:51:37.818+00',	NULL,	1),
(71,	'9139ad56-61a4-4785-80e1-be71a002ec19',	'df89741adc40c691dc03315c4be6de1a.jpeg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 14:13:00.627+00',	'2024-07-24 14:13:00.627+00',	NULL,	4),
(72,	'9f9f74cb-19a4-4f2e-aead-11798b7e7d87',	'ac0a780a-a4b0-489f-8c1c-a0b6c4b59a9a.png',	'image/png',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 15:33:20.578+00',	'2024-07-24 15:33:20.578+00',	NULL,	1),
(73,	'4f252a18-4fb7-41ef-954b-21afb491a4ef',	'a3adae5d-84c2-47ac-9dd2-94903d3099f6.png',	'image/png',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 15:33:43.679+00',	'2024-07-24 15:33:43.679+00',	NULL,	1),
(65,	'524b0170-3233-4110-9c2f-65b2d7f93af1',	'VOUCHER DE PRUEBA I 03-13.Pdf',	'application/pdf',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-02 21:04:20.689+00',	'2024-07-02 21:04:20.689+00',	NULL,	1),
(66,	'9a121637-805b-481e-a56d-c1893b7f8a74',	'Boleta_06535086_202406_SATO_ONUMA_JOSE_MIGUEL.pdf',	'application/pdf',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-03 20:00:34.654+00',	'2024-07-03 20:00:34.654+00',	NULL,	1),
(74,	'5fca754c-04c9-4de9-8cb7-6f9b95b3187d',	'Mar-del-zur-lugar.jpg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:03:15.322+00',	'2024-07-24 21:03:15.322+00',	83,	1),
(75,	'6fe5223b-6adc-4abc-8183-99309f6fb8b2',	'ac3788c0-5fa4-4972-a804-f74eddfbc5db.png',	'image/png',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:03:15.482+00',	'2024-07-24 21:03:15.482+00',	83,	1),
(76,	'aa1ac7b7-d233-4fda-a275-0658b216741d',	'ac0a780a-a4b0-489f-8c1c-a0b6c4b59a9a.png',	'image/png',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:03:15.597+00',	'2024-07-24 21:03:15.597+00',	83,	1),
(78,	'1e90d190-84c0-45fc-9e04-f6e2a7b4f487',	'WhatsApp Image 2024-07-15 at 2.51.16 PM.jpeg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:25:49.978+00',	'2024-07-24 21:25:49.978+00',	83,	1),
(79,	'3b2b8670-ec8b-4610-96b5-397deaa69f0b',	'Boleta_10297742_202405.pdf',	'application/pdf',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:25:50.091+00',	'2024-07-24 21:25:50.091+00',	83,	1),
(80,	'9a4b896f-0b7b-404c-b748-3c07c04d79b4',	'simple-filename(6).jpg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:26:08.899+00',	'2024-07-24 21:26:08.899+00',	83,	1),
(81,	'e7904d73-6551-4386-9517-4e50d864835d',	'simple-filename(10).jpg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:26:09.002+00',	'2024-07-24 21:26:09.002+00',	83,	1),
(82,	'2dbc4895-ae6e-4ed2-b340-81c6974b5d7b',	'simple-filename(14).jpg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:26:09.101+00',	'2024-07-24 21:26:09.101+00',	83,	1),
(83,	'705f80b2-41d1-4e45-84cf-cd70d78acd9e',	'simple-filename(15).jpg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:26:09.205+00',	'2024-07-24 21:26:09.205+00',	83,	1),
(84,	'b6f07411-b582-47f2-9212-27ae511739e8',	'simple-filename(16).jpg',	'image/jpeg',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-07-24 21:26:09.311+00',	'2024-07-24 21:26:09.311+00',	83,	1);
```

## Estructura de archivos en S3

Si revisas el bucket s3 vas a ver varias carpetas principales
```
documents/
files/
firmas/
```

Todos los archivos del file manager estan dentro de la carpeta `files/`, y a su ves los archivos estan dentro de una carpeta con el nombre del id del registro de la base de datos de la tabla `Folders`. Por lo que la ruta completa seria similar a esta
```
files/<Folder Id>/name-of-the-file.jpg <-- Estructura
files/34/image.jpg <-- Ejemplo
```
