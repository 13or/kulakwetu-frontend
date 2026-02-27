// src/app/features/super-admin/subscriptions/subscriptions.component.ts
import { Component, ViewChild} from '@angular/core';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';


import { MatTableDataSource, MatTableModule  } from '@angular/material/table';

import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from '../../../shared/custom-pagination/pagination.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { pageSelection, routes, SidebarService } from '../../../core/core.index';
import { SubscriptionApiService } from '../../../core/api/subscription-api.service';
import { SubscriptionDto } from '../../../core/models/subscription.model';
import { CompanyInfo } from '../../../shared/model/page.model';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  standalone: true,
  imports: [CommonModule,MatSortModule,MatTableModule,MatSelectModule,CustomPaginationComponent,FormsModule,NgApexchartsModule]
})
export class SubscriptionsComponent {
  public routes = routes;
  @ViewChild('chart')
  chart!: ChartComponent;
  public Areachart: Partial<ChartOptions> | any;
  public Areachart2: Partial<ChartOptions> | any;
  public Areachart3: Partial<ChartOptions> | any;
  public Areachart4: Partial<ChartOptions> | any;
  initChecked = false;
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  // pagination variables
  public pageSize = 10;
  public tableData: CompanyInfo[] = [];
  public tableDataCopy: CompanyInfo[] = [];
  public actualData: CompanyInfo[] = [];
  public currentPage = 1;
  public skip = 0;
  public limit: number = this.pageSize;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  public isLoading = false;
  public errorMessage = '';
  public pageSelection: pageSelection[] = [];
  dataSource!: MatTableDataSource<CompanyInfo>;
  public searchDataValue = '';
  public password: boolean[] = [false,false,false,false];
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  constructor(
    private subscriptionApiService: SubscriptionApiService,
    private router: Router,
    private pagination: PaginationService,
    private sidebar :SidebarService
  ) {

    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.superadminSubscriptions) {
        this.pageSize = res.pageSize;
        this.getTableData({ skip: res.skip, limit: res.limit });
      }
    });
  }
  private getTableData(pageOption: pageSelection): void {
    const page = Math.floor(pageOption.skip / this.pageSize);

    this.isLoading = true;
    this.errorMessage = '';

    this.subscriptionApiService
      .list(page, this.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.tableData = [];
          this.tableDataCopy = [];
          this.actualData = [];
          this.serialNumberArray = [];
          this.totalData = response.totalElements;

          response.content.forEach((item: SubscriptionDto, index: number) => {
            const serialNumber = page * this.pageSize + index + 1;
            const row: CompanyInfo = {
              sNo: serialNumber,
              isSelected: false,
              CompanyName: item.companyName ?? '-',
              BillCycle: item.billingCycle ?? '-',
              PaymentMethod: item.paymentMethod ?? '-',
              Email: item.email ?? '-',
              AccountURL: item.accountUrl ?? '-',
              Plan: item.plan ?? '-',
              CreatedDate: item.createdAt ?? '-',
              ExpiringDate: item.expiringAt ?? '-',
              Image: 'company-01.svg',
              Status: item.status ?? 'Active',
              Amount: item.amount !== undefined ? String(item.amount) : '-',
              DomainStatus: item.domainStatus ?? '-',
              InvoiceID: item.invoiceId ?? item.id,
            };

            this.tableData.push(row);
            this.tableDataCopy.push(row);
            this.actualData.push(row);
            this.serialNumberArray.push(serialNumber);
          });

          this.dataSource = new MatTableDataSource<CompanyInfo>(this.actualData);
          this.pagination.calculatePageSize.next({
            totalData: this.totalData,
            pageSize: this.pageSize,
            tableData: this.tableData,
            tableDataCopy: this.tableDataCopy,
            serialNumberArray: this.serialNumberArray,
          });
        },
        error: (error) => {
          this.errorMessage = error?.message ?? 'Impossible de charger les abonnements.';
          this.tableData = [];
          this.tableDataCopy = [];
          this.actualData = [];
          this.dataSource = new MatTableDataSource<CompanyInfo>([]);
        },
      });
  }


  public row=true;
  public searchData(value: string): void {
    this.searchDataValue = value.trim().toLowerCase();
    this.dataSource.filter = this.searchDataValue;
    this.tableData = this.dataSource.filteredData;
    this.row = this.tableData.length > 0;

    if (this.searchDataValue !== '') {
      // Handle filtered data
      this.pagination.calculatePageSize.next({
        totalData: this.tableData.length,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.tableData.map((_, i) => i + 1),
      });
    } else {
      // Handle reset to full data
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.serialNumberArray,
      });
    }
  }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();

    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];

        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  public changePageSize(pageSize: number): void {
    this.pageSelection = [];
    this.limit = pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.pagination.tablePageSize.next({
      skip: this.skip,
      limit: this.limit,
      pageSize: this.pageSize,
    });
  }
  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
  }
  ngOnInit(): void {
    // ... partie charts inchangée ...
  }
}
