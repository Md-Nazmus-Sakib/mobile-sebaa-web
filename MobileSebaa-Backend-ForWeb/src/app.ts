import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message:
      'Welcome to the Mobile Sebaa API! Use /api/shop  to See All Mobile Shop Data.',
  });
});

// Global Error Handel
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
