import { Component } from '@angular/core';
import * as Winwheel from 'winwheel';
import { NGXLogger } from 'ngx-logger';
import TronWeb from 'tronweb';
import { UtilsService } from './utils/utils.service';
import { BehaviorSubject } from 'rxjs';

declare let window : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ring';
  red = "#dc3545";
  grey = "#6c757d";
  blue = "#007bff";
  gold = "#ffc107";
  wheel;
  stopAt;
  segmentNumber;
  contractAddress = "TU4Nsq4YLaRZhHsYw8HmFe5uQX1FQekTn5";
  worldSpinner;
  address;
  seconds;
  inputNumber : number;
  private tronweb : TronWeb | any;

  constructor(private tronWebService : UtilsService, private logger : NGXLogger){}

    async ngOnInit() : Promise<any>{
      this.initWheel().then(a => {
        this.alertPrize();
      });
      this.onPlatformReady().then(async () => {})
      
    }

    private async onPlatformReady() {
      this.registerTronWeb();
    }
  
    protected registerTronWeb(): void {
      window.addEventListener('load', () => {
          this.tronWebService.initTronWeb()
              .then(async () => {
                  this.logger.info('Ring' + ' Successfully launched');
                  this.timer();
                  this.startEventListener();
                    })
                    .catch(() => {
                    this.logger.error('Could not initialize the app');
                });
        });
  }

      async initWheel() : Promise<any>{
      this.wheel = new Winwheel({
        'numSegments' : 54,
        'centerX'     : 260,
        'centerY'     : 320,
        'lineWidth'   : 1,
        'innerRadius' : 180,
        'segments'    :
        [
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.red,  'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.gold, 'text' : '50'},
          {'fillStyle' : this.blue, 'text' : '3'},
          {'fillStyle' : this.grey, 'text' : '2'},
        ],
        'animation' :
        {
          'type' : 'spinToStop',
          'duration' : 5,
          'spins' : 10,
          //'callbackFinished' : JSON.stringify(this.alertPrize())
        }
      });
      console.log(this.wheel);
    }

    async timer(){
      const contract1 = await window.tronWeb.contract().at(this.contractAddress);
      const res1 = await contract1.time().call();
      var countDown = (res1.toNumber() * 1000) + 35000;
      let x = setInterval(async ()=>{
        let now = new Date().getTime();
        let distance = countDown - now;
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(this.seconds < 10){
          this.seconds = "0" + Math.floor((distance % (1000 * 60)) / 1000);
        }
        console.log(distance, this.seconds);
        if(distance <= 0) {
          this.seconds = 0;
          clearInterval(x);
          this.address = await window.tronWeb.defaultAddress.base58;
          console.log(this.address);
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
      let res = await contract.PlayGame(150).watch(async (err, result) => {
        if (err) return console.log("ERROR")
        if(result){
          let res = await contract.random().call();
          this.segmentNumber = res.toNumber();
          this.inputNumber = parseInt(this.wheel.segments[this.segmentNumber].text);
          console.log(this.segmentNumber, "INPUT : " + this.inputNumber);
          this.spinOf();
        }
      })
      let res2 = await contract.StopGame(this.inputNumber).watch(async (err, result) => {
        if(err) return console.log("ERROR")
        if(result){
            this.timer();
        }
      })
    }

    async stopAngle() : Promise<any>{
    
      this.segmentNumber;
      if(this.segmentNumber != 0){
      this.stopAt = this.wheel.getRandomForSegment(this.segmentNumber);
      this.wheel.animation.stopAngle = this.stopAt;
      }
      else{
       this.segmentNumber++;
       this.stopAt = this.wheel.getRandomForSegment(this.segmentNumber);
       this.wheel.animation.stopAngle = this.stopAt;
          }
      
    }

     async spin() : Promise<any>{
      this.stopAngle().then(a => {
      this.wheel.startAnimation();
      console.log(this.wheel.animation.stopAngle);
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
                    console.log(bets.betType.toNumber(), bets.player, bets.value.toNumber());
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
                this.initWheel();
            });
          })
    }

    async betTwo(trx: number){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betTwo().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      })
    }

    async betThree(trx: number){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betThree().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      })
    }

    async betFive(trx: number){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betFive().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      })
    }

    async betFifty(trx: number){
      const contract = await window.tronWeb.contract().at(this.contractAddress);
      let res3 = await contract.betFifty().send({
          feeLimit: 10000000,
          callValue: trx * 1000000,
          shouldPollResponse : false
      })
    }
    

}
