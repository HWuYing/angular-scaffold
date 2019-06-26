import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-index',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ ConfigService ],
})
export class HomeComponent implements OnInit {
  public entryConfig: any = this.config.searchForm;
  constructor(private config: ConfigService) { }

  ngOnInit() { }

}
