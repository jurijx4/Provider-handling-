import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';

import { ContractService } from './wallet/contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  address: string= '';
  balance: string = '';
  network: string = '';
  accountNumber: number = 0;
  sideBarOpen = true;

  //wallet component
  provider: any;
  web3js: any;
  switchNetworkToEthereum:any;
  switchNetworkToPolygon:any;
  signMessage: any;
  eventListener: any;

  
 
  constructor(private contractService : ContractService){
    //this.contractService.setEventListenersMetaMask();
  }
  

  async connectUser(){

    this.provider = await this.contractService.connectAccount()
  }
  


  async signMessageMetaMask(){
    this.contractService.signMetaMask(this.web3js);
  }

  async signMessageFortmatic(){
    this.contractService.signMessageFortmatic(this.web3js);
  }
  async listenEvents(){
    this.contractService.setEventListenersMetaMask(this.provider);
  }


  //@dev setting functions for specific providers (sign message, change network, event listeners)
  async setProviderFunctions(provider: any){
    if(provider === this.provider){
    let providerName = this.contractService.checkProvider(provider);

      if(providerName == "MetaMask" && typeof window.ethereum !== undefined && provider.isMetaMask && !provider.isFortmatic){
        this.switchNetworkToEthereum = this.contractService.switchToEthereumMetaMask;
        this.switchNetworkToPolygon = this.contractService.switchToPolygonMetaMask;
        this.signMessage = this.contractService.signMetaMask;
        this.eventListener = this.contractService.setEventListenersMetaMask;


      }else if(providerName == "Fortmatic" && provider.isFortmatic){
        this.switchNetworkToEthereum = this.contractService.switchToEthereumFortmatic;
        this.switchNetworkToEthereum = this.contractService.switchToPolygonFortmatic;
        this.signMessage = this.contractService.signMessageFortmatic;
        this.eventListener = this.contractService.setEventListenersFortmatic;
      }
    }
  }

  async switchNetworkToPolygonMetaMask(){
    this.contractService.switchToPolygonMetaMask();
  }

  async switchNetworkToEthereumMetaMask(){
    this.contractService.switchToEthereumMetaMask();
  }

  async switchNetworkToPolygonFortmatic(){
    this.contractService.switchToPolygonFortmatic();
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  createWeb3(provider: any){
    if(provider === this.provider){
      this.web3js =  new Web3(provider);
    }
  }

  async checkIfMetaMaskIsConnected(){
    
    let tempProvider = window.ethereum;
    let tempWeb3js = new Web3(tempProvider);
    let hasAccounts = await tempWeb3js.eth.getAccounts()

    if (hasAccounts.length != 0 && tempProvider.isMetaMask) {
      this.provider = window.ethereum;
      this.createWeb3(this.provider);
    } else {
        this.provider= await this.contractService.connectAccount();
        this.createWeb3(this.provider);
    }

    console.log(Boolean(this.provider));
    
    
  }
 async ngOnInit(): Promise<void> {
    await this.checkIfMetaMaskIsConnected(); 
    await this.setProviderFunctions(this.provider);
  }
}
