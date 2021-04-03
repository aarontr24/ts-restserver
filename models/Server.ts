import express, { Application } from 'express';
import userRoutes from '../routes/user';
import authRoutes from '../routes/auth'
import cors from 'cors';
import mongoose from 'mongoose';

class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        users: '/api/users',
        auth: '/api/auth'
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';

        // Métodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            await mongoose.connect(process.env.DB_CNN || '', {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
            console.log('DB online');
            
        } catch (error) {
            console.log(error);
            throw new Error('Error al inicializar la DB');
        }
    }

    middlewares() {
        // CORS
        this.app.use( cors());

        // Lectura del body
        this.app.use( express.json() );

        // Carpeta pública
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use( this.apiPaths.users, userRoutes);
        this.app.use( this.apiPaths.auth, authRoutes);
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port );
            
        })
    }

}

export default Server;
