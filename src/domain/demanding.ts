import { Player } from "./player";
import { Property } from "./property";

export class Demanding extends Player {
  public wantsToBuyProperty(property: Property): boolean {
    return property.rentPrice > 50;
  }
}