import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/database';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question :{
              points:number,
              question:string,
              answer:string
            }
  @Output() onClose= new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.listenDB()
  }

  user : string;
  uid : string;
  listenDB(){
    console.log('listening db stops')
    var stopsRef = firebase.database().ref('game/stops');
    stopsRef.on('value', (snapshot)=> {
      console.log('newSomethinf')
      snapshot.forEach((child) => {
        if(!this.user){
          this.user = child.val().user;
          this.uid = child.val().uid;
          this.initTimer(5);
        }
      });
    });
  }

  seconds = 0;
  centiSeconds = 0;
  initTimer(seconds){
    var end = new Date().getTime() + (seconds * 1000);
    var x = setInterval(()=> {
      var now = new Date().getTime();
      var d = end - now;
      this.seconds = Math.floor((d % (1000 * 60)) / 1000);
      this.centiSeconds = Math.floor((d % (1000)) / 10);
      if (d < 0) {
        clearInterval(x);
        this.closeQuestion();
      }
    },10);
  }

  closeQuestion(){
    this.onClose.emit({event:'close',uid:null, points:null});
  }

  success(){
    this.onClose.emit({event:'success',uid:this.uid, points:this.question.points});
  }

  error(){
    this.onClose.emit({event:'error',uid:this.uid, points:this.question.points});
  }

}
