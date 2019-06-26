import { Component, OnInit } from '@angular/core';
import { HomeConfigService } from './services/home-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ HomeConfigService ],
})
export class AppComponent implements OnInit {
  public title = 'app';
  constructor() { }

  ngOnInit() {
  }
}
