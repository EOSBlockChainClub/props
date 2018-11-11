import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  public myProps = [{
    hashtag: '#props10',
    receiveAmount: '10 PRPS',
    acceptedPlatforms: 'Twitter, Instagram'
  }, {
    hashtag: '#props10',
    receiveAmount: '10 PRPS',
    acceptedPlatforms: 'Twitter, Instagram'
  }, {
    hashtag: '#props10',
    receiveAmount: '10 PRPS',
    acceptedPlatforms: 'Twitter, Instagram'
  }];
  public earnedProps = [
    {
      from: '@angryYogi25',
      platform: 'twitter',
      amountReceived: '10',
      date: new Date('11/08/2018')
    },
    {
      from: '@angryYogi25',
      platform: 'twitter',
      amountReceived: '24',
      date: new Date('11/02/2018')
    },
    {
      from: '@angryYogi25',
      platform: 'twitter',
      amountReceived: '55',
      date: new Date('10/31/2018')
    },
    {
      from: '@angryYogi25',
      platform: 'twitter',
      amountReceived: '12',
      date: new Date('10/25/2018')
    }
  ];
  displayedColumnsMyProps: string[] = ['hashtag', 'platform', 'acceptedPlatforms'];
  displayedColumns: string[] = ['from', 'platform', 'amountReceived', 'date'];
  ngOnInit() {
  }

}
