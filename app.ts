import dotenv from 'dotenv'
import Server from './models/Server';

// Configurar dotenv
dotenv.config();

const server = new Server();

server.listen();
