import { Team } from './team';
import { Round } from './round';
import { Color } from './color.enum';
import { GameState } from './game-state.enum';

class Player {
  name: string;

  constructor(name) {
    this.name = name;
  }
}

export class Match {
  teams: Map<string, Team> = new Map<string, Team>();
  rounds: Round[] = [];
  winner: Team | null = null;
  scores: Map<string, number> = new Map<string, number>();

  public constructor() {
  }

  public setTeam(names: Player[], teamName: string) {
    this.teams.set(teamName, new Team(names, teamName));
    this.scores.set(teamName, 0);
  }

  public startRound(taker: Player, trump: Color) {
    const takerTeam = this.findTeamByPlayer(taker.name);
    const round = new Round({ taker, takerTeam, trump });
    round.setDefendingTeam(this.getOpponentTeam(takerTeam));
    this.rounds.push(round);
  }

  /**
   * Round de "deux"
   */
  public skipRound() {
    this.rounds.push(new Round({ gameState: GameState.TWICE }));
  }

  public endRound() {
  }

  private findTeamByPlayer(playerName): Team {
    let playerTeam = null;
    this.teams.forEach((team) => {
      if (team.names.includes(playerName)) {
        playerTeam = team;
      }
    });
    return playerTeam;
  }

  private getOpponentTeam(takerTeam: Team): Team {
    let opponentTeam = null;
    this.teams.forEach((team) => {
      if (team !== takerTeam) {
        opponentTeam = team;
      }
    });
    return opponentTeam;
  }
}
