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
  contractAddress = "TGmQyZ3vcYWgmtVkNty2MQsBtJcgz8Yavf";
  privateKey = "d5999de297b839ac83156511c5aa03d328a22c417f3265972288fe2e5e0d6642";
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
        this.privateKey

        this.logger.debug('SUCCESS');
      }
      if (!this.loggedIn){
        console.log("Logged out");
      }
      this.tronweb = new TronWeb (
        fullNode,
        solidityNode,
        eventServer,
        this.privateKey
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
        this.privateKey
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