import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public dataSource: any[] = [{}];
  public total: number = 0;
  constructor(private config: ConfigService, private router: Router) { }

  ngOnInit() { }

  fetchRecords(fields?: any) {
    setTimeout(() => {
      this.dataSource = new Array(50).join(',').split(',').map((item, index) => ({
        name: index
      }));
      this.total = 300;
    });
  }

  go(path: string) {
    this.router.navigate([path]);
  }
}
