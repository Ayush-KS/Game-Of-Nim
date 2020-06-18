import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Nim';
  machineScore:number;
  yourScore:number;
  updateScores(scores) {
    this.machineScore = scores.machineScore;
    this.yourScore = scores.yourScore;
  }
}
