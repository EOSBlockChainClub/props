import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xero-default-layout',
  templateUrl: 'default-layout.component.html',
  styleUrls: ['default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public static: boolean;
  public config = {
    url: 'ShopSheriff.com',
    year: new Date().getFullYear(),
    name : 'Shop Sheriff'
  };
  constructor() { }
  ngOnInit(): void { }
}
