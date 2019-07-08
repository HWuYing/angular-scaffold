import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../services/index.service';

@Component({
  selector: 'app-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
  providers: [ ConfigService ],
})
export class IndexComponent implements OnInit {
  public columns: any[] = this.config.tableColumn;
  public entryConfig: any = this.config.searchForm;
  public dataSource: any[] = [];
  public total: number = 0;
  constructor(private config: ConfigService, private router: Router) { }

  ngOnInit() { }

  fetchRecords(fields?: any) {
    console.log(fields);
  }

  go(path: string) {
    this.router.navigateByUrl(path);
  }
}
