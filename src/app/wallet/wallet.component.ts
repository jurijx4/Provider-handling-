import { Component, OnInit } from '@angular/core';
import { ContractService } from './contract.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  provider: any;
  address: string= '';
  balance: string = '';
  network: string = '';

  switchNetwork: any;  

  constructor(private contractService : ContractService) { }

  async connectUser(){
     this.contractService.connectAccount()
  }

  

  ngOnInit(): void {
  }

}
