import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sent-props',
  templateUrl: './sent-props.component.html',
  styleUrls: ['./sent-props.component.scss']
})
export class SentPropsComponent implements OnInit {
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
      to: 'somebody',
      platform: 'twitter',
      amountSent: '10',
      status: '@angryYogi25',
      date: new Date('11/08/2018')
    },
    {
      to : 'somebody',
      platform: 'twitter',
      amountSent: '24',
      status: '@angryYogi25',
      date: new Date('11/02/2018')
    },
    {
      to : 'somebody',
      platform: 'twitter',
      amountSent: '24',
      status: '@angryYogi25',
      date: new Date('11/02/2018')
    },
    {
      to : 'somebody',
      platform: 'twitter',
      amountSent: '24',
      status: '@angryYogi25',
      date: new Date('11/02/2018')
    }
  ];
  displayedColumnsMyProps: string[] = ['hashtag', 'platform', 'acceptedPlatforms'];
  displayedColumns: string[] = ['to', 'platform', 'amountSent', 'status', 'date'];
  ngOnInit() {
  }
}
