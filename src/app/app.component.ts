import { Component } from '@angular/core';
import * as Winwheel from 'winwheel';
import { NGXLogger } from 'ngx-logger';
import TronWeb from 'tronweb';
import { UtilsService } from './utils/utils.service';
import { BehaviorSubject } from 'rxjs';
import * as cryptojs from 'crypto-js';
declare let window : any;
declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ring';
  size = 14;
  page = 1;
  pageSize = 10;
  wheel;
  stopAt;
  segmentNumber;
  contractAddress = "TGA8nyWpuDcuDchcBBjZcVDC545g1nZg4w";
  address;
  seconds;
  decenas;
  milis;
  milis2;
  inputNumber : number;
  showTwo = [];
  showThree = [];
  showFive = [];
  showFifty = [];
  image = "../assets/greys.png";
  total2x : number = 0;
  players2x : number = 0;
  total3x : number = 0;
  players3x : number = 0;
  total5x : number = 0;
  players5x : number = 0;
  total50x : number = 0;
  players50x : number = 0;
  player2xAddress : string;
  player3xAddress : string;
  player5xAddress : string;
  player50xAddress : string;
  previousPlays = [];
  aux = [];
  trx;
  balance;
  salt;
  hash;
  greyPointer;
  bluePointer;
  purplePointer;
  yellowPointer;
  animationState = 0;
  indication : string;
  audio = new Audio("../assets/spin.mp3"); //= <HTMLAudioElement>document.getElementById("tick");
  muted = false;
  aux2 : number = 1;
  dialogOpenGrey : boolean = true;
  dialogOpenBlue : boolean = true;
  dialogOpenPurple : boolean = true;
  dialogOpenYellow : boolean = true;
  myBetHistory = [];
  address2;
  address3;
  private tronweb : TronWeb | any;

  constructor(private tronWebService : UtilsService, private logger : NGXLogger){}

    async ngOnInit() : Promise<any>{
      this.stopAt = 270;
      this.loadImages();
      this.initWheel();
      this.onPlatformReady();
    }

    private async onPlatformReady() {
      this.registerTronWeb().then(a => {}); 
    }
  
    protected async registerTronWeb() {
      window.addEventListener('load', () => {
          this.tronWebService.initTronWeb()
              .then(async () => {
                  this.logger.info('Ring' + ' Successfully launched');
                  this.timer();
                  this.startEventListener();
                  this.eventListenerTwo();
                  this.eventListenerThree();
                  this.eventListenerFive();
                  this.eventListenerFifty();
                  this.checkBalance();
                  this.address = await window.tronWeb.defaultAddress.base58;
                  this.addressShort();
                  this.myBets();
                    })
                    .catch(() => {
                    this.logger.error('Could not initialize the app');
                });
        });
  }   
      loadImages(){
      let wheelImg = new Image();
      wheelImg.onload = () => {
        this.wheel.wheelImage = wheelImg;
        this.wheel.draw();
      }
      wheelImg.src = "../assets/roulettespacingsmall.png";
      }

      async initWheel() : Promise<any>{
        let playSound = setTimeout(() => {
          if(this.muted != true){
          let audio = new Audio("../assets/spin.mp3");
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 0.2;
          audio.play();
            }
        }, 2);
      this.wheel = new Winwheel({
        'canvasId'    : 'canvas',
        'numSegments' : 54,
        'rotationAngle' : this.stopAt,
        'responsive' : false,
        'centerX'     : 258,
        'centerY'     : 320,
        'lineWidth'   : 1,
        'innerRadius' : 200,
        'drawMode'    : 'image',
        'imageOverlay' : false,
        'segments'    :
        [
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '50'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '5'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '3'},
          {'text' : '2'},
          {'text' : '5'},
        ],
        'animation' :
        {
          'type' : 'spinToStop',
          'duration' : 4,
          'spins' : 3,
          'yoyo' : false,
          'easing': 'Power2.easeOut',
          'callbackBefore' : 'let rand = Math.floor(Math.random()*4); if(rand == 0){document.getElementById("prize").style.backgroundImage="url(../assets/pointergris.png)";}else if(rand == 1){document.getElementById("prize").style.backgroundImage="url(../assets/pointerb.png)";}else if (rand == 2){document.getElementById("prize").style.backgroundImage="url(../assets/pointerm.png)";}else if(rand == 3){document.getElementById("prize").style.backgroundImage="url(../assets/punteroam.png)";}',
          'callbackSound' : playSound,
        }
      });
    }

    muteAudio(){
      this.muted = true;
    }

    unMute(){
      this.muted = false;
    }
    async timer(){
      this.indication = "Place your bets";
      const contract1 = await window.tronWeb.contract().at(this.contractAddress);
      const res1 = await contract1.time().call();
      var countDown = (res1.toNumber() * 1000) + 26000;
      let x = setInterval(async ()=>{
        let now = new Date().getTime();
        let distance = countDown - now;
        let dec1 = Math.floor((distance % (1000 * 60)) / 1000);
        let dec = (""+dec1).split("");
        this.seconds = dec[1];
        this.decenas = dec[0];
        //this.milis = ((distance % (10000)));
        this.milis2 = Math.floor((distance % (1000))/100);//decisegundo
        let n = Math.floor((distance % (1000))/10);//centisegundo
        let n2 = (""+n).split("");
        this.milis = n2[1];
        if(distance <= 0) {
          this.milis = "";
          this.milis2 = 0;
          this.decenas = "";
          this.seconds = 0;
          clearInterval(x);
          this.indication = "Stop placing bets";
          this.address = await window.tronWeb.defaultAddress.base58;
          //stop all
          (<HTMLButtonElement>document.getElementById('b1')).disabled = true;
          (<HTMLButtonElement>document.getElementById('b2')).disabled = true;
          (<HTMLButtonElement>document.getElementById('b3')).disabled = true;
          (<HTMLButtonElement>document.getElementById('b4')).disabled = true;
          try{
            if (this.address == "TGCtEoQ4TVMCSQv8rzAWCCXn8qpHEBxNsB"){
            const contract = await window.tronWeb.contract().at(this.contractAddress);
              var res = await contract.play().send({
                feeLimit: 10000000,
                callValue: 0,
                shouldPollResponse : false
              })
            }
          }catch(e){}
        }
      })
    }

    async startEventListener(){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res = await contract.PlayGame().watch(async (err, result) => {
        if (err) return console.log("ERROR")
        if(result){
          console.log(result);
          this.indication = "Finding a winner";
          let res = await contract.random().call();
          this.segmentNumber = res.toNumber();
          this.inputNumber = parseInt(this.wheel.segments[this.segmentNumber].text);
          console.log(this.segmentNumber, "INPUT : " + this.inputNumber);
          this.previousPlays.push(this.inputNumber);
          this.salt = await contract.salt().call();
          this.hash = cryptojs.SHA256(this.salt+this.segmentNumber);
          this.spinOf();
        }
      })
      let res2 = await contract.StopGame(this.inputNumber).watch(async (err, result) => {
        if(err) {this.timer();}
        if(result){
            console.log(result);
            this.indication = "Preparing next round"
            this.showTwo = [];
            this.showThree = [];
            this.showFive = [];
            this.showFifty = [];
            this.total2x = 0;
            this.total3x = 0;
            this.total5x = 0;
            this.total50x = 0;
            this.players2x = 0;
            this.players3x = 0;
            this.players5x = 0;
            this.players50x = 0;
            (<HTMLButtonElement>document.getElementById('b1')).disabled = false;
            (<HTMLButtonElement>document.getElementById('b2')).disabled = false;
            (<HTMLButtonElement>document.getElementById('b3')).disabled = false;
            (<HTMLButtonElement>document.getElementById('b4')).disabled = false;
            setTimeout(() => {
              this.timer();
            }, 4000)
        }
      })
    }

    async eventListenerTwo(){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res = await contract.NewBetTwo().watch(async (err, result) => {
        if(err) return console.log("ERROR")
        if(result){
          result.result.amount = result.result.amount/1000000;
          let pre = await window.tronWeb.address.fromHex(result.result.player).toString();
          let fin = pre.substring(0,5);
          result.result.player = fin;
          this.showTwo.push(result);
          this.total2x += result.result.amount;
          this.players2x = this.showTwo.length;
        }
      })
    }

    async eventListenerThree(){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res = await contract["NewBetThree"]().watch(async (err, result) => {
        if(err) return console.log("ERROR")
        if(result){
          result.result.amount = result.result.amount/1000000;
          let pre = await window.tronWeb.address.fromHex(result.result.player).toString();
          let fin = pre.substring(0,5);
          result.result.player = fin;
          this.showThree.push(result);
          this.total3x += result.result.amount;
          this.players3x = this.showThree.length;
        }
      })
    }

    async eventListenerFive(){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res = await contract["NewBetFive"]().watch(async (err, result) => {
        if(err) return console.log("ERROR")
        if(result){
          result.result.amount = result.result.amount/1000000;
          let pre = await window.tronWeb.address.fromHex(result.result.player).toString();
          let fin = pre.substring(0,5);
          result.result.player = fin;
          this.showFive.push(result);
          this.total5x += result.result.amount;
          this.players5x = this.showFive.length;
        }
      })
    }

    async eventListenerFifty(){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res = await contract["NewBetFifty"]().watch(async (err, result) => {
        if(err) return console.log("ERROR")
        if(result){
          result.result.amount = result.result.amount/1000000;
          let pre = await window.tronWeb.address.fromHex(result.result.player).toString();
          let fin = pre.substring(0,5);
          result.result.player = fin;
          this.showFifty.push(result);
          this.total50x += result.result.amount;
          this.players50x = this.showFifty.length;
        }
      })
    }

    async stopAngle() : Promise<any>{
      if(this.segmentNumber != 0){
      this.stopAt = this.wheel.getRandomForSegment(this.segmentNumber);
      if(this.stopAt == 0) this.stopAt = 366;
      this.wheel.animation.stopAngle = this.stopAt;
      }
      else{
       this.segmentNumber++;
       this.stopAt = this.wheel.getRandomForSegment(this.segmentNumber);
       if(this.stopAt == 0) this.stopAt = 366;
       this.wheel.animation.stopAngle = this.stopAt;
          }
      
    }

     async spin() : Promise<any>{
      this.stopAngle().then(a => {
      this.wheel.startAnimation();
      })
    }

      async alertPrize() : Promise<any>{
      console.log(this.wheel.segments[this.segmentNumber].text);
    }

    async spinOf(): Promise<any>{
            this.spin().then(a => {
              this.alertPrize().then(async b => {
                if(this.address == "TGCtEoQ4TVMCSQv8rzAWCCXn8qpHEBxNsB"){
                const contract = await window.tronWeb.contract().at(this.contractAddress);
                let res = await contract.betLenght().call();
                let trx : number = 0;
                for(let i = 0; i < res.toNumber(); i++){
                  let bets = await contract.bets(i).call();
                  if(bets.betType.toNumber() == this.inputNumber){
                    let numBet = bets.value.toNumber();
                    trx += numBet;
                  }
                }
                console.log("AMOUNT : ", trx);
                let res3 = await contract.stop(this.inputNumber).send({
                  feeLimit: 1000000000,
                  callValue: trx * this.inputNumber,
                  shouldPollResponse : false
                    })
                  }
                this.loadImages();
                this.checkBalance();
                this.initWheel();
            });
            setTimeout(a => {
              if(this.inputNumber == 2) {
                document.getElementById("indication").style.color = "#473f3d";
                document.getElementById("seconds").style.color = "#473f3d";
                document.getElementById('prize').style.backgroundImage="url(../assets/pointergris.png)"; 
              }
              if(this.inputNumber == 3){
                document.getElementById("indication").style.color = "#228df0";
                document.getElementById("seconds").style.color = "#228df0";
                document.getElementById('prize').style.backgroundImage="url(../assets/pointerb.png)"; 
              }
              if(this.inputNumber == 5){
                document.getElementById("indication").style.color = "#5632af";
                document.getElementById("seconds").style.color = "#5632af";
                document.getElementById('prize').style.backgroundImage="url(../assets/pointerm.png)"; 
              }
              if(this.inputNumber == 50){
                document.getElementById("indication").style.color = "#fcc235";
                document.getElementById("seconds").style.color = "#fcc235";
                document.getElementById('prize').style.backgroundImage="url(../assets/punteroam.png)"; 
              }
              this.aux.push({
                a:this.inputNumber,
                hash: this.hash,
                salt: this.salt,
                rand: this.segmentNumber
              });
            }, 4025)
          })
    }
    async betTwo(trx: number){
      if(trx == null || trx == undefined)trx = 10;
      if(trx < 10 || (trx > this.balance && this.balance < 10)){
        ((<HTMLInputElement>document.getElementById("bet")).value) = "10";
      }
      else{
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betTwo().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      }).then(() => this.checkBalance())
      }
      if(trx > this.balance){
        this.trx = this.balance;
      }
    }

    async betThree(trx: number){
      if(trx == null || trx == undefined)trx = 10;
      if(trx < 10 || (trx > this.balance && this.balance < 10)){
        ((<HTMLInputElement>document.getElementById("bet")).value) = "10";
      }
      else{
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betThree().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      }).then(() => this.checkBalance())
      }
      if(trx > this.balance){
        this.trx = this.balance;
      }
    }

    async betFive(trx: number){
      if(trx == null || trx == undefined)trx = 10;
      if(trx < 10 || (trx > this.balance && this.balance < 10)){
        ((<HTMLInputElement>document.getElementById("bet")).value) = "10";
      }
      else{
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betFive().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      }).then(() => this.checkBalance())
      }
      if(trx > this.balance){
        this.trx = this.balance;
      }
    }

    async betFifty(trx: number){
      if(trx == null || trx == undefined)trx = 10;
      if(trx < 10 || (trx > this.balance && this.balance < 10)){
        ((<HTMLInputElement>document.getElementById("bet")).value) = "10";
      }
      else{
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betFifty().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      }).then(() => this.checkBalance())
      }
      if(trx > this.balance){
        this.trx = this.balance;
      }
    }

    async checkBalance(){
      let address = await window.tronWeb.defaultAddress.base58;
      let res = await window.tronWeb.trx.getBalance(address);
      let aux = parseInt(res);
      this.balance = aux / 1000000;
    }

    min(){
      this.trx = 10;
      ((<HTMLInputElement>document.getElementById("bet")).value) = this.trx;
    }

    half(){
      let val = Math.floor(this.trx/2);
      if(val < 10) {((<HTMLInputElement>document.getElementById("bet")).value) = "10";}
      else {this.trx = val;((<HTMLInputElement>document.getElementById("bet")).value) = this.trx;}
    }

    double(){
      this.trx = parseInt((<HTMLInputElement>document.getElementById("bet")).value);
      if(!isNaN(this.trx)){
      let val = Math.floor(this.trx * 2);
      this.trx = val;
      if(val > this.balance) {this.trx = this.balance}
      else ((<HTMLInputElement>document.getElementById("bet")).value) = this.trx;
      }
      else{
        this.trx = 10;
      }
    }

    max(){
      this.trx = this.balance;
    }

    openPreviousGrey(){
      let x = (<HTMLDialogElement>document.getElementById("previous-grey"));
      x.showModal();
      this.dialogOpenGrey = true;
      console.log("open");
    }

    closePreviousGrey(){
      let x = (<HTMLDialogElement>document.getElementById("previous-grey"));
      x.close(); 
      this.dialogOpenGrey = false;
      console.log("close");
    }

    openPreviousBlue(){
      let x = (<HTMLDialogElement>document.getElementById("previous-blue"));
      x.showModal();
      this.dialogOpenBlue = true;
      console.log("open");
    }

    closePreviousBlue(){
      let x = (<HTMLDialogElement>document.getElementById("previous-blue"));
      x.close(); 
      this.dialogOpenBlue = false;
      console.log("close");
    }

    openPreviousPurple(){
      let x = (<HTMLDialogElement>document.getElementById("previous-purple"));
      x.showModal();
      this.dialogOpenPurple = true;
      console.log("open");
    }

    closePreviousPurple(){
      let x = (<HTMLDialogElement>document.getElementById("previous-purple"));
      x.close(); 
      this.dialogOpenPurple = false;
      console.log("close");
    }

    openPreviousYellow(){
      let x = (<HTMLDialogElement>document.getElementById("previous-yellow"));
      x.showModal();
      this.dialogOpenYellow = true;
      console.log("open");
    }

    closePreviousYellow(){
      let x = (<HTMLDialogElement>document.getElementById("previous-yellow"));
      x.close(); 
      this.dialogOpenYellow = false;
      console.log("close");
    }

    async myBets() : Promise<any>{
      this.myBetHistory = [];
      try{
      let address = await window.tronWeb.defaultAddress.base58; 
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res = await contract.getLength(address).call();
      let res2 = res.toNumber();
      console.log(res2);
      for(let i=(res2-1); i >= 0; i--){
        this.address.toString();
        let res3 = await contract.myBets(address, i).call();
        let res4 = await contract.previous(res3.round.toNumber()).call();
        res3.value = res3.value.toNumber() / 1000000;
        let winner = this.wheel.segments[res4.random ].text;
        this.myBetHistory.push({
          value: res3.value,
          betType: res3.betType,
          timestamp: res3.timestamp,
          winner: winner
        });
        console.log(this.myBetHistory);
      }
    }catch(e){}
    }

    addressShort(){
      this.address2 = this.address.substring(0,4);
      this.address3 = this.address.substring(this.address.length - 4,this.address.length);
    }
}