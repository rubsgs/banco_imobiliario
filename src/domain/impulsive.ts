import { Player } from "./player";
import { Property } from "./property";

export class Impulsive extends Player{
  public wantsToBuyProperty(property: Property): boolean {
    return true;
  }
}