import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import TronWeb from 'tronweb';
declare let window: any;

export interface Request {
  person: string;
  processed: boolean;
  date: number;
  amount: number;
};

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private tronweb : TronWeb | any;
  contractAddress = "THNQEqHtfM1Axqv84yaA57oP9juP3rLEDa";
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  balance;

  constructor( private logger : NGXLogger) { }
  
  async initTronWeb(){
    return new Promise(resolve => {
      if (typeof window.tronWeb != 'undefined') {
        if (window.tronWeb && window.tronWeb.ready != undefined){
        this.loggedIn.next(window.tronWeb && window.tronWeb.ready);
         }
      let fullNode = 'https://api.trongrid.io';
      let solidityNode = 'https://api.trongrid.io';
      let eventServer = 'https://api.trongrid.io';
      
      if (this.loggedIn){
        fullNode = window.tronWeb.currentProviders().fullNode.host;
        solidityNode = window.tronWeb.currentProviders().solidityNode.host;
        eventServer = window.tronWeb.currentProviders().eventServer.host;

        this.logger.debug('SUCCESS');
      }
      if (!this.loggedIn){
        console.log("Logged out");
      }
      this.tronweb = new TronWeb (
        fullNode,
        solidityNode,
        eventServer,
      )
      window.tronWeb.on('addressChanged', () => {
        this.logger.info('Address changed to : ' + this.getAddress);
      })
      return resolve();
    } else {
      this.logger.debug('No? Try!');
      window.tronWeb = new TronWeb(
        'https://api.shasta.trongrid.io',
        'https://api.shasta.trongrid.io',
        'https://api.shasta.trongrid.io',
      );
      return resolve();
    }
  })
  }

  get getAddress(): string {
    return window.tronWeb.defaultAddress.base58 || undefined;
  }

  async getAccount(): Promise<any> {
    return new Promise((resolve: any) => {
        window.tronWeb.trx.getAccount(this.getAddress).then(account => {
            resolve(account);
        });
    }) as Promise<any>;
  }
}