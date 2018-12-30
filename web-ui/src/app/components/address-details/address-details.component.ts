import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Balance } from '../../models/balance';
import { Transaction } from '../../models/transaction';

import { AddressesService } from '../../services/addresses.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit {

  address: Balance;
  addressString: string;

  // pagination
  limit = 10;
  items: Transaction[] = [];

  constructor(
    private route: ActivatedRoute,
    private addressesService: AddressesService,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.addressString = this.route.snapshot.paramMap.get('address');
    this.addressesService.get(this.addressString).subscribe(
      response => this.onAddressRetrieved(response),
      response => this.onError(response)
    );
  }

  private onAddressRetrieved(response: Balance) {
    this.address = response;
    this.load();
  }

  load() {
    const order = 'desc';
    let lastSeenTxid = '';
    if (this.items.length > 0) {
      lastSeenTxid = this.items[this.items.length - 1].id;
    }

    this.addressesService
      .getTransactionsV2(this.addressString, this.limit, lastSeenTxid, order)
      .do(response => this.items = this.items.concat(response.data))
      .subscribe();
  }

  private onError(response: any) {
    this.errorService.renderServerErrors(null, response);
  }
}
