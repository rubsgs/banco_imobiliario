import { Player } from "./player";
import { Property } from "./property";

export class Random extends Player {
  public wantsToBuyProperty(property: Property): boolean {
    const chance = 1 + Math.floor(Math.random() * 100);
    return chance > 50;
  }
}