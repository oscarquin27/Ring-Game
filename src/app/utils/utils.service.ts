import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import TronWeb from 'tronweb';
import { debug } from 'util';
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
  contractAddress = "TW1X9m5pjcAof1g8BJ8Jdd1uUWdntJQZj4";
  FOUNDATION_ADDRESS = 'TGCtEoQ4TVMCSQv8rzAWCCXn8qpHEBxNsB';
  public loggedIn: boolean = false;
  balance;
  OtherObject : any;

  constructor( private logger : NGXLogger) { }
  
  async initTronWeb(){
    return new Promise(async resolve => {
      console.log("Initializing")
      if (typeof window.tronWeb != 'undefined') {
        if (window.tronWeb != undefined && window.tronWeb.ready != false){
          console.log("ITS TRUE HE IS LOGGED IN");

         }
      let address = await window.tronWeb || false;
      let fullNode = 'https://api.shasta.trongrid.io';
      let solidityNode = 'https://api.shasta.trongrid.io';
      let eventServer = 'https://api.shasta.trongrid.io';
      let address2 = await window.tronWeb.defaultAddress.base58;
      if (address && address2 != false){
        fullNode = 'https://api.shasta.trongrid.io'//window.tronWeb.currentProviders().fullNode.host;
        solidityNode = 'https://api.shasta.trongrid.io'//window.tronWeb.currentProviders().solidityNode.host;
        eventServer = 'https://api.shasta.trongrid.io'//window.tronWeb.currentProviders().eventServer.host;
        this.logger.info('SUCCESS', address2);
      }
      else{
          console.log("ITS false");
        window.tronWeb = new TronWeb(
          fullNode = 'https://api.shasta.trongrid.io',//window.tronWeb.currentProviders().fullNode.host;
          solidityNode = 'https://api.shasta.trongrid.io',//window.tronWeb.currentProviders().solidityNode.host;
          eventServer = 'https://api.shasta.trongrid.io'//window.tronWeb.currentProviders().eventServer.host;
        )
        await window.tronWeb.setAddress('TL6aqANC1UrmSxpjqL3tAU1UuEEEsEoX1y');
      }
      this.tronweb = new TronWeb (
        fullNode,
        solidityNode,
        eventServer,
      )
      window.tronWeb.on('addressChanged', async () => {
        this.logger.info('Address changed to : ' + this.getAddress);
        await window.tronWeb.setAddress(this.getAddress);
      })
      return resolve();
    } else {
      this.logger.debug('No? Try!');
      console.log("initializing because error");
      window.tronWeb = new TronWeb(
        'https://api.shasta.trongrid.io',
        'https://api.shasta.trongrid.io',
        'https://api.shasta.trongrid.io',
      );
      await window.tronWeb.setAddress('TL6aqANC1UrmSxpjqL3tAU1UuEEEsEoX1y');
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