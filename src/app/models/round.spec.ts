import { Round } from './round';
import { GameState } from './game-state.enum';
import { RoundState } from './round-state.enum';
import { Team } from './team';
import { Color } from './color.enum';

describe('Round class', () => {
  const takerTeam = new Team([{ name: 'Kiou' }, { name: 'MH' }], 'Nous');
  const defendingTeam = new Team([{ name: 'Carmen' }, { name: 'André' }], 'Eux');

  it('should effectively skip the round when given state TWICE', () => {
    const round = new Round({ gameState: GameState.TWICE });
    expect(round.gameState).toEqual(GameState.TWICE);
    expect(round.roundState).toEqual(RoundState.OVER);
  });

  it('should initialize a new Round with a Taker and trump Spade', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    expect(round.gameState).toBeUndefined();
    expect(round.roundState).toEqual(RoundState.IN_PROGRESS);
    expect(round.takerTeam).toBe(takerTeam);
    expect(round.defendingTeam).toBe(defendingTeam);
    expect(round.taker).toEqual({ name: 'Kiou' });
    expect(round.trump).toEqual(Color.SPADE);
  });

  it('should play a full round with a result of WIN for taker team', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBonus(takerTeam, 50);
    round.setBelote(defendingTeam);
    round.setScore(takerTeam, 84);
    expect(round.gameState).toEqual(GameState.WON);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(0);
    expect(round.scores.get('Nous')).toEqual(130);
    expect(round.scores.get('Eux')).toEqual(100);
  });

  it('should play a full round with a result of DEDANS', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBelote(defendingTeam);
    round.setScore(takerTeam, 84);
    expect(round.gameState).toEqual(GameState.DEDANS);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(0);
    expect(round.scores.get('Nous')).toEqual(0);
    expect(round.scores.get('Eux')).toEqual(180);
  });

  it('should play a full round with a result of DEDANS (bonus steal)', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBonus(takerTeam, 50);
    round.setScore(takerTeam, 54);
    expect(round.gameState).toEqual(GameState.DEDANS);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(0);
    expect(round.scores.get('Nous')).toEqual(0);
    expect(round.scores.get('Eux')).toEqual(210);
  });

  it('should play a full round with a result of DEDANS (belote keep)', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBelote(takerTeam);
    round.setScore(defendingTeam, 96);
    expect(round.gameState).toEqual(GameState.DEDANS);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(0);
    expect(round.scores.get('Nous')).toEqual(20);
    expect(round.scores.get('Eux')).toEqual(160);
  });

  it('should play a full round with a result of LITIGE (taker belote)', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBelote(takerTeam);
    round.setScore(takerTeam, 71);
    expect(round.gameState).toEqual(GameState.LITIGE);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(70);
    expect(round.scores.get('Nous')).toEqual(20);
    expect(round.scores.get('Eux')).toEqual(90);
  });

  it('should play a full round with a result of LITIGE (def belote)', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBelote(defendingTeam);
    round.setScore(takerTeam, 91);
    expect(round.gameState).toEqual(GameState.LITIGE);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(90);
    expect(round.scores.get('Nous')).toEqual(0);
    expect(round.scores.get('Eux')).toEqual(90);
  });

  it('should play a full round with a result of CAPOT', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBonus(takerTeam, 20);
    round.setBelote(defendingTeam);
    round.declareCapot(takerTeam);
    expect(round.gameState).toEqual(GameState.CAPOT);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(0);
    expect(round.scores.get('Nous')).toEqual(270);
    expect(round.scores.get('Eux')).toEqual(20);
  });

  it('should play a full round with a result of CAPOT-DEDANS', () => {
    const round = new Round({ taker: { name: 'Kiou' }, takerTeam, trump: Color.SPADE });
    round.setDefendingTeam(defendingTeam);
    round.setBonus(takerTeam, 100);
    round.setBelote(takerTeam);
    round.declareCapot(defendingTeam);
    expect(round.gameState).toEqual(GameState.CAPOT);
    expect(round.roundState).toEqual(RoundState.OVER);
    expect(round.litigiousPoints).toEqual(0);
    expect(round.scores.get('Nous')).toEqual(20);
    expect(round.scores.get('Eux')).toEqual(350);
  });

  describe('CalculateScore', () => {
    it('should correctly round numbers considering Belote rules', () => {
      expect(Round['calculateScore'](0)).toEqual(0);
      expect(Round['calculateScore'](5)).toEqual(0);
      expect(Round['calculateScore'](9)).toEqual(10);
      expect(Round['calculateScore'](11)).toEqual(10);
      expect(Round['calculateScore'](16)).toEqual(20);
      expect(Round['calculateScore'](17)).toEqual(20);
    });
  });
});
