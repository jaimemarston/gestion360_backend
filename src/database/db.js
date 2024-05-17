import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log({
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  PORT: process.env.PORT
})

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false,
  port: process.env.POSTGRES_PORT,
});

export { sequelize };
