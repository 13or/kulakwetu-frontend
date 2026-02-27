// src/app/features/user-management/users/users.component.ts
import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  pageSelection,
  SidebarService,
} from '../../../core/core.index';
import { UserApiService } from '../../../core/api/user-api.service';
import { UserDto } from '../../../core/models/user.model';
import { routes } from '../../../core/helpers/routes';
import { users } from '../../../shared/model/page.model';
import { PaginationService, tablePageSize } from '../../../shared/custom-pagination/pagination.service';
import { MatSelectModule } from '@angular/material/select';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports: [MatSelectModule,CustomPaginationComponent,FormsModule,MatSortModule,CommonModule]
})
export class UsersComponent {
  initChecked = false;
  selectedValue1 = '';
  selectedValue2 = '';
  selectedValue3 = '';
  selectedValue4 = '';
  selectedValue5 = '';
  selectedValue6 = '';
  selectedValue7 = '';

  public routes = routes;
  // pagination variables
  public tableData: Array<users> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<users>;
  public searchDataValue = '';
  public row=true;
  public isLoading = false;
  public errorMessage = '';
  //** / pagination variables

  constructor(
    private userApiService: UserApiService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.users) {
        this.pageSize = res.pageSize;
        this.getTableData({ skip: res.skip, limit: res.limit });
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    const page = Math.floor(pageOption.skip / this.pageSize);

    this.isLoading = true;
    this.errorMessage = '';

    this.userApiService
      .list(page, this.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.tableData = [];
          this.serialNumberArray = [];
          this.totalData = response.totalElements;

          response.content.forEach((item: UserDto, index: number) => {
            const serialNumber = page * this.pageSize + index + 1;
            const row: users = {
              sNo: serialNumber,
              img: 'user-01.jpg',
              userName: item.username || `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || 'N/A',
              phone: item.phoneNumber ?? '-',
              email: item.email ?? '-',
              role: (item.role ?? item.roles?.[0] ?? 'CONSUMER').toUpperCase(),
              createdOn: item.createdAt ?? '-',
              status: item.status ?? 'Active',
              isSelected: false,
            };

            this.tableData.push(row);
            this.serialNumberArray.push(serialNumber);
          });

          this.dataSource = new MatTableDataSource<users>(this.tableData);
          this.pagination.calculatePageSize.next({
            totalData: this.totalData,
            pageSize: this.pageSize,
            tableData: this.tableData,
            serialNumberArray: this.serialNumberArray,
          });
        },
        error: (error) => {
          this.errorMessage = error?.message ?? 'Impossible de charger les utilisateurs.';
          this.tableData = [];
          this.dataSource = new MatTableDataSource<users>([]);
          this.row = false;
        },
      });
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
        serialNumberArray: this.tableData.map((_, i) => i + 1), // Generates serials like [1, 2, 3...]
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
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }


  public password : boolean[] = [false];

  public togglePassword(index: number){
    this.password[index] = !this.password[index]
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
}
