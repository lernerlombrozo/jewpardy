import { Component } from '@angular/core';

import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import 'firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jewpardy';

  ngOnInit(){
	firebase.initializeApp(environment.firebaseConfig);
	this.getGame();
  }

  counter=0;
  resetAll(){
	if(this.counter ==10){
		firebase.database().ref('game/').remove((error)=>{
			if (error) {
			  alert('error deleting')
			} else {
				alert('restarted database')
			}
		});
		this.counter = 0;
	}
	this.counter++
	}

	gamePoints:any;
	gamePointsArray:any[]=[];
	getGame(){
		var gameRef = firebase.database().ref('game/points');
		gameRef.on('value', (snapshot) => {
			this.gamePoints = snapshot.val();
			this.gamePointsArray=[];
			for (var key of Object.keys(this.gamePoints)) {
				this.gamePointsArray.push(this.gamePoints[key])
			}
			console.log('XXXXX',this.gamePointsArray);
		});
	}

	initQuestion(){
		return firebase.database().ref('game/stops').remove((error)=>{
			if (error) {
			  alert('error deleting')
			} else {
				console.log('deleted stops')
			}
		});
	}

	selectedQuestion:{
		points:number,
		question:string,
		answer:string
	}
	categoryIndex:number;
	questionIndex:number;
	questionOpened = false;
	closeQuestion(event){
		if(event.event==='success'){
			this.addPoints(event.uid, event.points, event.email)
		} else if (event.event==='error'){
			this.removePoints(event.uid, event.points, event.email)
		}else{
			this.categoryIndex=null;
			this.questionIndex=null;
		}
		this.questionOpened=false;
	}

	openQuestion(question,categoryI,questionI){
		if(question.answered) return;
		this.initQuestion().then((success)=>{
			this.categoryIndex = categoryI;
			this.questionIndex = questionI;
			this.selectedQuestion = question;
			this.questionOpened=true;
		})
	}

	addPoints(uid,points, email){
		if(this.gamePoints && this.gamePoints[uid] && this.gamePoints[uid].points){
			points = points + this.gamePoints[uid].points;
		}
		var pointsRef = firebase.database().ref('game/points/'+uid);
		pointsRef.set({points,email}).then((res)=>{
		}).catch((err)=>{
			console.log(err)
		})
		this.game[this.categoryIndex].questions[this.questionIndex].answered=true;
	}

	removePoints(uid,points,email){
		if(this.gamePoints && this.gamePoints[uid] && this.gamePoints[uid].points){
			points = Math.max(this.gamePoints[uid].points-points,0);
		}
		var pointsRef = firebase.database().ref('game/points/'+uid);
		pointsRef.set({points,email}).then((res)=>{
		}).catch((err)=>{
			console.log(err)
		})
	}
  

	game: {
		name:string,
		questions:{
			points:number,
			question:string,
			answer:string,
			answered?:Boolean
		}[]
	}[] = [
		{
			name:'Israeli Culture',
			questions:[
				{
					points:100,
					question:'Name the 4 most common religions in Israel',
					answer: 'Jewish, Muslim, Christian and Druze'
				},{
					points:200,
					question:'What food is Israel famous for?',
					answer: 'Falafel'
				},{
					points:300,
					question:'State three uses of the world shalom',
					answer: 'Peace, Hello, Goodbye'
				},{
					points:400,
					question:'What is the difference between a Kibbutz and a Moshav?',
					answer: 'Kibbutz is a unique, worker-controlled, agricultural production cooperative and the Moshav is a service cooperative in which the members are the individual farmers which reside within the settlement.',
				},{
					points:500,
					question:'What is the name of the music genre or musical tradition of Ashkenazi Jews originating from Eastern Europe during the 17th century? (commonly heard in weddings and other celebrations)',
					answer:'Klezmer',
				},
			]
				
		}, {
			name:'Famous Jews',
			questions:[
				{
					points:100,
					question:`The movie "Don't Mess With the Zohan" was played by which famous actor starring the role of Zohan`,
					answer: 'Adam Sandler'
				},{
					points:200,
					question:'Which famous Canadian artist had the most singles ever charting in the Billboard hot 100 with 27 tracks.',
					answer: 'Drake (6 God/Champagnepapi)'
				},{
					points:300,
					question:'This icon is known for the formula E=MC2',
					answer: 'Albert Einstein'
				},{
					points:400,
					question:'This actor is famous for his role in the High School Musical movies',
					answer: 'Zac Efron',
				},{
					points:500,
					question:'This famous actor is known for his famous sayings such as "I am king of the castle", "Wa wa wi wa", "Very nice I like".',
					answer:'Sacha Baron Cohen.',
				},
			]
				
		}, {
			name:'Jewish Traditions',
			questions:[
				{
					points:100,
					question:'How many sons did Haman have from the story of Purim?',
					answer: '10'
				},{
					points:200,
					question:'What are the 3 items we say blessings over on shabbat?',
					answer: 'Candles, wine, challah'
				},{
					points:300,
					question:`According to the Jewish Bible, which of the following is NOT kosher?
					a) Lays chips
					b) Giraffe milk
					c) Catfish
					d) Starbucks
					e) Timmies Camomile Tea`,
					answer: 'c) Catfish'
				},{
					points:400,
					question:'This holiday commemorates the receiving of the 10 commandments on Mount Sinai',
					answer: 'Shavuot'
				},{
					points:500,
					question:'Name the 10 plagues of Egypt we read about during Passover',
					answer:'Blood, frogs, lice, flies, livestock dying, boils, hail, locusts, darkness, and death of firstborn'
				},
			]
		}, {
			name:'Mitzvot',
			questions:[
				{
					points:100,
					question:'What is tefillin called in English?',
					answer: 'Phylacteries'
				},{
					points:200,
					question:'This is what we do each week in temple on the Sabbath. It helps us learn about our history and the mitzvot',
					answer: 'Reading the weekly portion of the Torah'
				},{
					points:300,
					question:'This is one of the ten commandments. It involves two other people besides yourself.',
					answer: 'Honouring your mother and father.'
				},{
					points:400,
					question:'Name the mitzva that tells a Jew to give 10% of his income to charity.',
					answer: 'Tzedakah'
				},{
					points:500,
					question:'What are the 3 mitzvot specific to Jewish women?',
					answer:'Shabbat candles, make challah, and family purity/mikvah'
				},
			]
		}, {
			name:'History',
			questions:[
				{
					points:100,
					question:`In which century were the Jews expelled from Spain
					a) 1200s
					b) 1300s
					c) 1400s 
					d) 1500s 
					e) 1700s`,
					answer:'1400s, specifically 1492',
				}, {
					points:200,
					question:'The people who destroyed the 2nd Temple in the year 70 CE',
					answer:'Romans',
				}, {
					points:300,
					question:'These are the 4 quarters in the Old City',
					answer:'Jewish, Muslim, Christian, Armenian',
				}, {
					points:400,
					question:'What is the name of the operation to bring 47,000 Yemenite Jews to the State of Israel?',
					answer:'Operation Magic Carpet',
				}, {
					points:500,
					question:`The Israeli Defense Force ran a covert operation in Entebbe, Uganda to rescue the passengers from what plane?
						a) EL AL 928
						b) British Airways 273
						c) American Airlines 999
						d) Air France 139
						e) IDF 273
					`,
					answer:'d) Air France 139',
				}
			]
				
		}, {
			name:'Miscellaneous',
			questions:[
				{
					points:100,
					question:'She was originally a Moabite princess who converted to Judaism and came to Israel with her mother-in-law instead of staying home like her sister',
					answer:'Ruth'
				}, {
					points:200,
					question:'He made the walls of Jericho fall and helped the Israelites conquer the land of Canaan.',
					answer:'Joshua',
				}, {
					points:300,
					question:`What proportion of the U.S. population are practicing Jews?
						a) 5.1%
						b) 9.5%
						c) 1.8%
						d) 0.9%
						e) 0.075%
					`,
					answer:'c) 1.8%',
				}, {
					points:400,
					question:`What is the name of the circle dance commonly performed in Israeli folk dances?`,
					answer:'Hora',
				}, {
					points:500,
					question:'What is the location and the name of the largest synagogue in the world?',
					answer:'Jerusalem and Belz Great Synagogue',
				}
			]
		}
	]

}
