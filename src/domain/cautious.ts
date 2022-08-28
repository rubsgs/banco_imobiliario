import { Player } from "./player";
import { Property } from "./property";

export class Cautious extends Player {
  public wantsToBuyProperty(property: Property): boolean {
    return this.currentBalance - property.salePrice > 80;
  }
}