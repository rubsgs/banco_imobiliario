import { Request, Response, Router } from "express";
import { Game } from "../domain/game";
import { makePlayers, makeProperties } from "../fixtures";

export class GameRoute {
  public router: Router = Router();
  
  constructor() {
    this.router.get(`/simular`, this.simulate);
  }
  
  private simulate(req: Request, res: Response) {
    const properties = makeProperties();
    const players = makePlayers();
    const game = new Game(properties, players);
    const result = game.run();
    res.send(result)
  }
}