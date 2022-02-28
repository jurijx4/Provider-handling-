
import { Injectable } from '@angular/core';
import Web3 from "web3";
import Web3Modal, { getInjectedProvider, getProviderInfo, getProviderInfoById } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Subject } from 'rxjs';
import Fortmatic from "fortmatic";
import { runInThisContext } from 'vm';
import { hostname } from 'os';


@Injectable({
  providedIn: 'root'
})
export class ContractService {

  providerName: string= '';
  web3Modal

  private accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

   constructor() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "https://mainnet.infura.io/v3/7d820307572144ec9582f132eb8dc278" // required
        }
      },
      fortmatic: {
        package: Fortmatic,
        display: {
          description: "Connect with your gmail..."
        },
        options: {
          // Mikko's TESTNET api key
          key: "pk_live_611A9721D94F7DE9"//test pk_test_8F00748205492DBC //main pk_live_611A9721D94F7DE9
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }


// no console LOGS IN PRODUCTION!!!!!
  async connectAccount(){
    this.web3Modal.clearCachedProvider();
    let provider;

    try {
       provider = await this.web3Modal.connect();
      console.log(provider);
    } catch(e) {
      console.error("Could not get a wallet connection", e);  
      return;
    }
    return provider;
  }

    checkProvider(provider: any){
    let providerName = getProviderInfo(provider).name;
    let isProvider;
    console.log(provider.isMetaMask);

    if(typeof window.ethereum !== undefined){
      if( provider.isMetaMask && providerName == "MetaMask"){
        isProvider= "MetaMask";
      }else{
        console.error("Your injected provider is not supported");
      }
    }else if(this.providerName == "Fortmatic" && provider.isFortmatic){
      isProvider= "Fortmatic";
    }else{
      console.error("There is no supported provider");
    }
    return isProvider;
  }

  
  
  

    //WEB3 works for all providers
    async createWeb3(provider: any){
      return new Web3(provider);
    }

    // Try & catch na najvišjem abstarctnem nivoju lahko tudi na nizjem dober habit za production

    //@dev get users address
    async getUserAccounts(web3js: any){
      var accounts = await web3js.eth.getAccounts();
      return (accounts);
    }

    //@dev get  user balance
    async getUserBalance(web3js: any){
      let accounts = await this.getUserAccounts(web3js)
      let balancewei = await web3js.eth.getBalance(accounts[0]);
      let ethBalance = web3js.utils.fromWei(balancewei, "ether");
      let balance  = parseFloat(ethBalance).toFixed(4);
      return balance;
    }

    //@dev get user Network
    async getUserNetwork(web3js: any){
      var chainId = await web3js.eth.getChainId();
      var network = '';
      switch (chainId) {
        case 1:
            network= 'Ethereum network';
            break;
        case 3:
          network= 'Ropsten network'
            break;
        case 4:
          network= 'Rinkeby network'
            break;
        case 137:
          network= 'Polygon network'
            break;
        default:
            network= 'Not supported'
            break;
      } 
      return network;
    }



    //METAMASK
    // Functions for injected MetaMask provider

    //@dev Switch to Polygon network in MetaMask... nehigher abstract level only if metamask is connected 
    async switchToPolygonMetaMask(){
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
      } catch (switchError: any) {

        if (switchError.code === -32002) {
          console.error("User has allready pending metamask request."); //design error hadnling 
        }

        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x89',
                  chainName: 'Polygon Mainnet',
                  rpcUrls: ['https://polygon-rpc.com/'] /* ... */,
                },
              ],
            });
          } catch (addError) {
            console.error("cant add network");
          }
        }
        // handle other "switch" errors
      }
    }

    //env to object 
    //parameters to  env 
    async switchToEthereumMetaMask(){
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });
      } catch (switchError: any) {
        console.log(switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === -32002) {
          console.error("User has allready pending metamask request."); //design error hadnling 
        }
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x1',
                  chainName: 'Polygon Mainnet',
                  rpcUrls: ['https://polygon-rpc.com/'] /* ... */,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    }

    ////@dev sign message with MetaMask
    async signMetaMask(web3js: any){
      try {
        const accounts = await await web3js.eth.getAccounts();
        const address = accounts[0]; 
        const signature = await web3js.eth.personal.sign("6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", address);
        console.log(signature);
        const signingAddress = web3js.eth.accounts.recover("6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", signature);
        console.log(address);
        console.log(signingAddress);
        //send to back end  message, signature & address
      } catch (error) {
        console.error(error);
      }
      
    }

  //@dev SET EVENT LISTENERS SOCKETS not supported on Fortmatic
   setEventListenersMetaMask(provider: any) {
    //@dev PROVIDER SOCKETS
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log(chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      console.log(info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log(error); // if disconnect change wallet state, dont display user & setting... user is not connected to the app any more
    });
  }



    //FORTMATIC
    // Functions for not injected Fortmatic provider

    //@dev Switch network to polygon
    async switchToPolygonFortmatic(){
      const customNodeOptions = {
        rpcUrl: 'https://rpc-mumbai.matic.today', // your own node url
        chainId: 80001 // chainId of your own node
      }
    
    // Setting network to localhost blockchain
    let provider = new Fortmatic('pk_test_8F00748205492DBC', customNodeOptions);
    return provider;
    //this.web3js = new Web3(this.provider);
    //var chainId = await this.web3js.eth.getChainId();
    ///console.log(chainId);
    } 

    async switchToEthereumFortmatic(){
      const customNodeOptions = {
        rpcUrl: 'https://rpc-mumbai.matic.today', // your own node url
        chainId: 80001 // chainId of your own node
      }
    
    // Setting network to localhost blockchain
    let provider = new Fortmatic('pk_test_8F00748205492DBC', customNodeOptions);
    return provider;
    //this.web3js = new Web3(this.provider);
    //var chainId = await this.web3js.eth.getChainId();
    ///console.log(chainId);
    }

    //provider.on("connect") nesme se reloadat memory leak ker nardis 100 instanc in vse poslusaj

    //@dev sign message with Fortmatic
    async signMessageFortmatic(web3js: any){
      // Required to convert message to Hex
      const ethUtil = require('ethereumjs-util');
      web3js.eth.getAccounts((error : any, accounts: any) => {
 
        if (error) throw error;
       
        const from = accounts[0];
        const msg = ethUtil.bufferToHex(new Buffer('YOUR_MESSAGE', 'utf8'));
        const params = [msg, from];
        const method = 'personal_sign';
       
        web3js.currentProvider.sendAsync({
          id: 1,
          method,
          params,
          from,
        }, function(error: any, result: any) {
          if (error) throw error;
          console.log("We are in");
          console.log(result);
        });
      });
    }


    //@dev set event listeners to Fortmatic wallet if they even exsists
    async setEventListenersFortmatic(){

    }
}
