import { GameState } from './game-state.enum';
import { Team } from './team';
import { Color } from './color.enum';
import { Player } from './player';
import { RoundState } from './round-state.enum';

export class Round {

  public static BELOTE_POINTS = 20;
  public static CAPOT_POINTS = 250;
  public static TOTAL_POINTS = 162;
  public roundState: RoundState;
  public gameState: GameState;
  public trump: Color;
  public takerTeam: Team;
  public taker: Player;
  public defendingTeam: Team;
  public bonuses: Map<string, number> = new Map<string, number>();
  public scores: Map<string, number> = new Map<string, number>();
  public litigiousPoints = 0;
  public belote: Team | null = null;

  constructor({ gameState, taker, takerTeam, trump }:
                { gameState?: GameState, taker?: Player, takerTeam?: Team, trump?: Color }) {
    this.gameState = gameState;
    this.taker = taker;
    this.takerTeam = takerTeam;
    this.trump = trump;

    if (this.gameState === GameState.TWICE) {
      this.roundState = RoundState.OVER;
    } else {
      this.roundState = RoundState.IN_PROGRESS;
      this.bonuses.set(takerTeam.teamName, 0);
    }
  }

  private static calculateScore(score: number): number {
    return Math.abs(Math.round((score - 1) / 10) * 10);
  }

  public setDefendingTeam(team: Team) {
    this.defendingTeam = team;
    this.bonuses.set(team.teamName, 0);
  }

  public setBonus(team: Team, value: number) {
    const teamName = team.teamName;
    this.bonuses.set(teamName, this.bonuses.get(teamName) + value);
  }

  public setBelote(team: Team) {
    this.belote = team;
  }

  /**
   * Set score to given team and compute all endgame states.
   */
  public setScore(team: Team, score: number) {
    const scores = {
      [this.takerTeam.teamName]: 0,
      [this.defendingTeam.teamName]: 0
    };

    const othTeamName = this.computeOtherTeam(team);
    scores[team.teamName] = this.bonuses.get(team.teamName) + score;
    scores[othTeamName] = (Round.TOTAL_POINTS - score) + this.bonuses.get(this.defendingTeam.teamName);

    // Set belote
    if (this.belote) {
      scores[this.belote.teamName] += Round.BELOTE_POINTS;
    }

    /** Sets game state and returns gameState and usable scores */
    if (scores[this.defendingTeam.teamName] > scores[this.takerTeam.teamName]) {
      /** Dedans */
      this.gameState = GameState.DEDANS;
      let bonuses = 0;
      this.bonuses.forEach((value) => bonuses += value);
      this.scores.set(this.defendingTeam.teamName,
        Round.calculateScore(Round.TOTAL_POINTS + bonuses + this.getBelotePointsByTeam(this.defendingTeam)));
      this.scores.set(this.takerTeam.teamName,
        Round.calculateScore(this.getBelotePointsByTeam(this.takerTeam)));
    } else if (scores[this.defendingTeam.teamName] === scores[this.takerTeam.teamName]) {
      /** Litige */
      this.gameState = GameState.LITIGE;
      this.scores.set(this.defendingTeam.teamName, Round.calculateScore(scores[this.defendingTeam.teamName]));
      const takerTeamBelotePoints = this.getBelotePointsByTeam(this.takerTeam);
      // Subtract BELOTE to litigious points and mark them anyway
      this.scores.set(this.takerTeam.teamName, Round.calculateScore(takerTeamBelotePoints));
      this.litigiousPoints = Round.calculateScore(scores[this.takerTeam.teamName] - takerTeamBelotePoints);
    } else {
      /** Taker team won the round */
      this.gameState = GameState.WON;
      // tslint:disable-next-line:forin
      for (const teamName in scores) {
        this.scores.set(teamName, Round.calculateScore(scores[teamName]));
      }
    }
    this.roundState = RoundState.OVER;
  }

  /**
   * Given team did all the takes, special reward and special game state
   */
  public declareCapot(team: Team) {
    // Capot-dedans
    if (team === this.defendingTeam) {
      let bonuses = 0;
      this.bonuses.forEach((value) => bonuses += value);
      this.scores.set(this.takerTeam.teamName,
        Round.calculateScore(this.getBelotePointsByTeam(this.takerTeam)));
      this.scores.set(this.defendingTeam.teamName,
        Round.calculateScore(Round.CAPOT_POINTS + bonuses + this.getBelotePointsByTeam(this.defendingTeam)));
    } else {
      // Regular capot
      this.scores.set(this.defendingTeam.teamName,
        this.bonuses.get(this.defendingTeam.teamName) + this.getBelotePointsByTeam(this.defendingTeam));
      this.scores.set(this.takerTeam.teamName,
        Round.CAPOT_POINTS + this.bonuses.get(this.takerTeam.teamName) + this.getBelotePointsByTeam(this.takerTeam));
    }
    this.gameState = GameState.CAPOT;
    this.roundState = RoundState.OVER;
  }

  private getBelotePointsByTeam(team: Team) {
    return (this.belote && this.belote.teamName === team.teamName) ? Round.BELOTE_POINTS : 0;
  }

  private computeOtherTeam(team: Team): string {
    return (team.teamName === this.takerTeam.teamName)
      ? this.defendingTeam.teamName
      : this.takerTeam.teamName;
  }
}
