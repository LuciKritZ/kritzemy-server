import express, {
  type Application,
  static as static_,
  json,
  urlencoded,
  NextFunction,
  Response,
  Request,
} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from '@/middlewares';
import { UserRouter } from '@/routes';

export default (ORIGINS: string[]): Application => {
  const app = express();

  // Body Parser
  app.use(json({ limit: '50mb' }));

  // Cookie Parser
  app.use(cookieParser());

  /**
   * CORS
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
   */
  app.use(
    cors({
      origin: ORIGINS,
    })
  );

  app.use(urlencoded({ extended: true }));

  // Routers
  app.use('/api/v1', UserRouter);

  // Testing routes
  app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      message: 'API is working',
    });
  });

  // Unknown routes
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    error.statusCode = 404;
    next(error);
  });

  app.use(ErrorMiddleware);

  return app;
};
