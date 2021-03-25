import { Component, OnInit } from '@angular/core';
import { Match } from './models/match';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Belote';
  public matches: any[] = [];

  public ngOnInit() {
    // Ask for players names and teams
  }

  public startMatch() {
    const match = new Match();
    this.matches.push(match);
  }
}
