import { Player } from './player';

export class Team {
  public names: Player[];
  public teamName: string;

  constructor(names: Player[], teamName: string) {
    this.names = names;
    this.teamName = teamName;
  }

}
