import express, { Application } from 'express';
import userRoutes from '../routes/user';
import authRoutes from '../routes/auth';
import uploadRoutes from '../routes/upload';
import refugeRoutes from '../routes/refuge';
import cors from 'cors';
import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        users: '/api/users',
        auth: '/api/auth',
        upload: '/api/upload',
        refuge: '/api/refuge',
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

        // BodyParser
        this.app.use( express.urlencoded({ extended: false}));
        // this.app.use( bodyParser.urlencoded({ extended: false}));

        // Carpeta pública
        this.app.use( express.static('public') );

        // FileUpload
        this.app.use( fileUpload() );
    }

    routes() {
        this.app.use( this.apiPaths.users, userRoutes);
        this.app.use( this.apiPaths.auth, authRoutes);
        this.app.use( this.apiPaths.upload, uploadRoutes);
        this.app.use( this.apiPaths.refuge, refugeRoutes);
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port );
            
        })
    }

}

export default Server;
