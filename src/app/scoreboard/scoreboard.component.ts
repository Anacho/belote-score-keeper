import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../models/match';

@Component({
  selector: 'scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  @Input() matches: Match[];

  constructor() { }

  ngOnInit() {
  }

}
