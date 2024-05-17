import * as dotenv from 'dotenv';
dotenv.config();

import Server from './src/server/server.js';

const servidor = new Server();
servidor.listen();
