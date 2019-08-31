import { Component } from '@angular/core';
import * as Winwheel from 'winwheel';


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
  constructor(){}

    ngOnInit(){
      this.initWheel().then(a => {
        this.alertPrize();
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
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.red,  'text' : '3x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.gold, 'text' : '50x'},
          {'fillStyle' : this.blue, 'text' : '5x'},
          {'fillStyle' : this.grey, 'text' : '2x'},
        ],
        'animation' :
        {
          'type' : 'spinToStop',
          'duration' : 5,
          'spins' : 8,
          //'callbackFinished' : JSON.stringify(this.alertPrize())
        }
      });
      console.log(this.wheel);
    }

    async stopAngle() : Promise<any>{
      this.segmentNumber = Math.floor((Math.random() * 55));
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

    spinOf(){
      this.spin().then(a => {
       this.alertPrize().then(b => {
        this.initWheel();
          });
        })
    }
    

}
