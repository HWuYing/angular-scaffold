import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-index',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ ConfigService ],
})
export class HomeComponent implements OnInit {
  public columns: any[] = this.config.tableColumn;
  public entryConfig: any = this.config.searchForm;
  public dataSource: any[] = [];
  public total: number = 0;
  constructor(private config: ConfigService) { }

  ngOnInit() { }

  fetchRecords(fields?: any) {
    console.log(fields);
  }
}
