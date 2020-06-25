import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})



export class TableComponent implements OnInit {
  @Output() onScoreChange: EventEmitter<any> = new EventEmitter<any>();
  sticks: any[][];
  isUserNext: number;
  winner: string;
  chosenRow: number;
  clicked: any;
  machineScore: number;
  yourScore: number;

  constructor() { }

  ngOnInit(): void {
    this.machineScore = this.yourScore = 0;
    this.newGame();
  }

  newGame() {
    this.chosenRow = -1;
    this.isUserNext = 0;
    this.onScoreChange.emit({machineScore: this.machineScore, yourScore: this.yourScore});
    this.winner = null;
    this.sticks = [];
    for(var i:number = 0; i < 4; i++) {
      this.sticks[i] = [];
    }
    this.sticks[0] = Array(1).fill(null);
    this.sticks[1] = Array(3).fill(null);
    this.sticks[2] = Array(5).fill(null);
    this.sticks[3] = Array(7).fill(null);
    for(let i = 1; i <= 4; i++) {
      var id = "row" + (i);
      id = id.toString();
      var stix = document.getElementById(id);
      for(let j = 0; j < stix.children.length; j++) {
        stix.children[j].classList.remove('hide');
      }
    }
    
  }

  hideStick(i:number, j:number) {
    if(this.chosenRow == -1) {
      this.chosenRow = i;
    } else if(this.chosenRow != i) {
      return;
    }
    this.isUserNext = 2;
    var id = "row" + (i+1);
    id = id.toString();
    var stix = document.getElementById(id);
    var singleStic = stix.children[j];
    singleStic.classList.add("hide");

    this.isGameOver("Machine");
  }

  isWinningPosition(rowsCount) {
    console.log(rowsCount);
    var a =  (rowsCount[1] ^ rowsCount[2] ^ rowsCount[3] ^ rowsCount[4]) == 0;
    var b = (rowsCount[1] | rowsCount[2] | rowsCount[3] | rowsCount[4]) == 1;

    return a !== b;
  }

  isGameOver(winz) {
    var flag = true;
    for(let i = 1; i <= 4; i++) {
      var id = "row" + (i);
      id = id.toString();
      var stix = document.getElementById(id);
      let count = 0;
      for(let j = 0; j < stix.children.length; j++) {
        if(!(stix.children[j].classList.contains('hide')))
          count++;
      }
      if(count != 0) {
        flag = false;
        break;
      }
    }
    if(flag) {
      if(winz == "Machine") {
        this.machineScore++;
      } else {
        this.yourScore++;
      }
      this.onScoreChange.emit({machineScore: this.machineScore, yourScore: this.yourScore});
      this.winner = winz;
    }
  }

  computerMove() {
    if(this.isUserNext == 1)
      return;
    this.isUserNext = 1;
    this.chosenRow = -1;
    let rowsCount = [5];
    
    for(let i = 1; i <= 4; i++) {
      var id = "row" + (i);
      id = id.toString();
      var stix = document.getElementById(id);
      let count = 0;
      for(let j = 0; j < stix.children.length; j++) {
        if(!(stix.children[j].classList.contains('hide')))
          count++;
      }
      rowsCount[i] = count;
      console.log(count);
    }

    var flag = false;
    for(let i = 1;  i <= 4; i++) {
      let temp = rowsCount[i];
      for(let j = rowsCount[i] - 1; j >=0; j--) {
        rowsCount[i] = j;
        if(this.isWinningPosition(rowsCount)) {
          let toDelete = temp - j;
          var id = "row" + (i);
          console.log(id);
          id = id.toString();
          var stix = document.getElementById(id);
          
          for(let j = 0; j < stix.children.length; j++) {
            if(!(stix.children[j].classList.contains('hide'))) {
              stix.children[j].classList.add('hide');
              toDelete--;
            }
            if(toDelete == 0) {
              flag = true;
              break;
            }
          }
        }
        if(flag == true)
          break;
      }

      if(flag == false)
        rowsCount[i] =temp;
      
      if(flag == true)
        break;
    }

    if(!flag) {
      var arr = [1,2,3,4];
      arr = this.shuffle(arr);
      console.log(arr);
      for(let i = 0; i < 4; i++) {
        if(rowsCount[arr[i]] > 0) {
          var toDelete = 1 + Math.floor(Math.random() * Math.floor(rowsCount[arr[i]] - 1));
          var id = "row" + (arr[i]);
          id = id.toString();
          var stix = document.getElementById(id);
          
          for(let j = 0; j < stix.children.length; j++) {
            if(!(stix.children[j].classList.contains('hide'))) {
              stix.children[j].classList.add('hide');
              toDelete--;
            }
            if(toDelete == 0)
              break;
          }
          break;
        }
      }
    }

    this.isGameOver("You");

  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  nextMove() {
    if(!this.isUserNext) {
      this.computerMove();
    }
  }
}
