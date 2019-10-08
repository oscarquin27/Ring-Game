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
  contractAddress = "TQF57KPBC4SkymeWfXYeiLqgSYGDQHZpn3";
  FOUNDATION_ADDRESS = 'TGCtEoQ4TVMCSQv8rzAWCCXn8qpHEBxNsB';
  public loggedIn: boolean = false;
  balance;

  constructor( private logger : NGXLogger) { }
  
  async initTronWeb(){
    return new Promise(resolve => {
      console.log("Initializing")
      if (typeof window.tronWeb != 'undefined') {
        if (window.tronWeb != undefined && window.tronWeb.ready != false){
        this.loggedIn = true;
        console.log("ITS TRUE HE IS LOGGED IN");

         }
      let fullNode = 'https://api.shasta.trongrid.io';
      let solidityNode = 'https://api.shasta.trongrid.io';
      let eventServer = 'https://api.shasta.trongrid.io';
      
      if (this.loggedIn == true){
        fullNode = 'https://api.shasta.trongrid.io'//window.tronWeb.currentProviders().fullNode.host;
        solidityNode = 'https://api.shasta.trongrid.io'//window.tronWeb.currentProviders().solidityNode.host;
        eventServer = 'https://api.shasta.trongrid.io'//window.tronWeb.currentProviders().eventServer.host;

        this.logger.info('SUCCESS');
      }
      if (this.loggedIn == false){
          console.log("ITS false HE IS LOGGED IN");
          window.tronWeb.defaultAddress = {
          hex: window.tronWeb.address.toHex(this.FOUNDATION_ADDRESS),
          base58 : this.FOUNDATION_ADDRESS
        }
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
      console.log("initializing because error");
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