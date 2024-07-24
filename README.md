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
