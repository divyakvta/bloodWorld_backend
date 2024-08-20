import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';


dotenv.config();

class App {
    public app: Application;
    private port: number | string;

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 8000;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling()
        connectDB();
    }

    private initializeMiddlewares():void {
        // this.app.use(cors({
        //     origin: process.env.CLIENT_URL, 
        //     credentials: true,
        //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
        //     allowedHeaders: ['Content-Type', 'Authorization']
        // }));

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended:true}));
        this.app.use(cookieParser());
    }

    private initializeRoutes(): void {
        this.app.use('/api/users', userRoutes );
        this.app.use('/api/admin', adminRoutes );
        this.app.get('/', (req: Request, res: Response) => res.send('Server is Ready'));
    }

    private initializeErrorHandling(): void {
        this.app.use(notFound);
        this.app.use(errorHandler);
    }



    public listen():void {
        this.app.listen(this.port, () => console.log(`Server Connected to the port ${this.port}`));
    }
}


const app = new App();
app.listen()
