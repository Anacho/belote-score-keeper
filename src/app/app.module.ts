import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatExpansionModule } from '@angular/material';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { GameManagerComponent } from './game-manager/game-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    ScoreboardComponent,
    GameManagerComponent
  ],
  imports: [
    BrowserModule,
    MatExpansionModule,
    NoopAnimationsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
