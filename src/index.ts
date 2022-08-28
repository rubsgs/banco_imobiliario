import express, { NextFunction, Request, Response } from 'express';
import { GameRoute } from './routes';

function init() {
  const app = express();
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    console.log(`Received request at ${req.path}`)
    next();
  })
  const gameRoute = new GameRoute();
  app.use('/jogo', gameRoute.router)
  const server = app.listen(3000, () => {
    console.log('Webserver is up')
  })
}

init();