import { Cautious, Demanding, Impulsive, Random } from "../domain";

export const makePlayers = () => [
  new Impulsive('impulsivo', 300),
  new Demanding('exigente', 300),
  new Cautious('cauteloso', 300),
  new Random('aleatório', 300)
]