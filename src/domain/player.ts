import { Property } from "./property";

export enum PlayerTurnAction {
  Pass,
  BuyCurrentProperty,
  PayRent
}

export abstract class Player {
  constructor(
    public name: string,
    protected balance: number = 300
  ){}

  public ownedProperties: Property[] = [];

  public lost = false;

  public roll() {
    return 1 + Math.floor(Math.random() * 6);
  }

  public shouldBuyProperty(property: Property): boolean {
    const playerCanBuy = property.salePrice <= this.balance && this.wantsToBuyProperty(property);
    if(!playerCanBuy)
      return false;

    return true;
  }

  public resolveTurnAction(property: Property): PlayerTurnAction {
    if(property.owner && property.owner !== this.name) {
      return PlayerTurnAction.PayRent;
    }

    if(this.shouldBuyProperty(property)) {
      return PlayerTurnAction.BuyCurrentProperty;
    }

    return PlayerTurnAction.Pass;
  }

  get currentBalance() {
    return this.balance;
  }

  public incrementBalance(increment: number) {
    this.balance += increment;
    return this.balance;
  }

  public decrementBalance(decrement: number) {
    this.balance -= decrement;
    if(this.balance < 0) {
      this.lost = true;
    }

    return this.balance;
  }

  private currentSpaceIndex: number = 0;

  get currentSpace() {
    return this.currentSpaceIndex;
  }

  public setCurrentSpace(newIndex: number) {
    this.currentSpaceIndex = newIndex;
  }

  public abstract wantsToBuyProperty(property: Property): boolean;
}