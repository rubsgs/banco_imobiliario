import { inspect } from 'util';
import { Player, PlayerTurnAction } from "./player";
import { Property } from "./property";

export type GameResult = {
  winner: string;
  ranking: string[];
}

export class Game {
  public readonly roundBonus = 100;
  public currentTurn = 0;
  constructor(public properties: Property[], public players: Player[], private maxTurns: number = 1000) {}
  
  public run() {
    let gameOver = this.currentTurn >= this.maxTurns;
    while(!gameOver) {
      this.currentTurn += 1;
      console.log(`Now running turn ${this.currentTurn}`);
      const currentPlayers = this.remainingPlayers
      this.runTurn(currentPlayers);
      
      gameOver = this.currentTurn >= this.maxTurns || this.remainingPlayers.length <= 1;
      this.debug()
      console.log('');
    }

    const ranking = this.ranking;
    return { winner: ranking[0], ranking };
  }

  public runTurn(currentPlayers: Player[]) {
    for(const player of currentPlayers) {
      if(this.remainingPlayers.length === 1) {
        console.log(`Only player ${player.name} remains, ending game;`);
        break;
      }

      let nextSpace = player.currentSpace + player.roll();
      if(nextSpace >= this.properties.length) {
        player.incrementBalance(this.roundBonus);
        nextSpace = nextSpace % this.properties.length;
      }

      player.setCurrentSpace(nextSpace);
      const currentProperty = this.properties[player.currentSpace];
      const action = player.resolveTurnAction(currentProperty);
      this.resolvePlayerTurn(player, currentProperty, action);
      if(player.lost) {
        console.log(`Player ${player.name} lost, removing associated properties`);
        this.resolvingLosingPlayer(player);
      }
    }
  }

  private resolvePlayerTurn(player: Player, property: Property, action: PlayerTurnAction) {
    console.log(`Player: ${player.name}|Current space: ${player.currentSpace}|Owner: ${property.owner}|Action: ${action}`)
    switch(action) {
      case PlayerTurnAction.BuyCurrentProperty:
        if(!property.owner) {
          console.debug(`Player ${player.name} is buying property at ${player.currentSpace}`)
          property.owner = player.name;
          player.decrementBalance(property.salePrice);
          player.ownedProperties.push(property);
        }
        break;
      case PlayerTurnAction.PayRent:
        console.debug(`Player: ${player.name} is paying rent to ${property.owner}`);
        const remainingBalance = player.decrementBalance(property.rentPrice);
        const receiver = this.remainingPlayers.find((player) => player.name === property.owner);
        const amountToReceive = remainingBalance > 0 ? property.rentPrice : property.rentPrice - remainingBalance;
        receiver!.incrementBalance(amountToReceive);
        console.debug(`Networths: ${player.name}:${player.currentBalance}, ${receiver!.name}:${receiver!.currentBalance}`);
        break;
      default:
        break;
    }
  }

  private resolvingLosingPlayer(player: Player) {
    this.properties.forEach((property) => {
      if(property.owner === player.name)
        property.owner = '';
    });

    player.ownedProperties = [];
  }

  private get remainingPlayers() {
    return this.players.filter((player) => !player.lost);
  }

  private get ranking() {
    return this.players.sort((a,b) => b.currentBalance - a.currentBalance).map((player) => player.name);
  }

  private debug() {
    console.debug('===========================================================================');
    console.debug(`Current turn: ${this.currentTurn}`);
    for(const player of this.players) {
      console.debug(`Player: ${player.name}`);
      console.debug(`Position: ${inspect(player.currentSpace)}`);
      console.debug(`Balance: ${inspect(player.currentBalance)}`);
      console.debug(`Lost: ${inspect(player.lost)}`);
      console.debug(`Properties: ${inspect(player.ownedProperties)}`);
      console.debug('');
    }
    console.debug('===========================================================================');
  }
}