import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from '../../../shared/custom-pagination/pagination.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { pageSelection, routes, SidebarService } from '../../../core/core.index';
import { CompanyApiService } from '../../../core/api/company-api.service';
import { CompanyDto } from '../../../core/models/company.model';
import { CompanyAccount } from '../../../shared/model/page.model';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { CustomPaginationComponent } from '../../../shared/custom-pagination/custom-pagination.component';
import { FormsModule } from '@angular/forms';
export interface ChartOptions  {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
}
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
  standalone: true,
  imports: [CommonModule,MatSortModule,MatTableModule,MatSelectModule,CustomPaginationComponent,FormsModule,NgApexchartsModule]
})
export class CompaniesComponent {
  @ViewChild('chart')
  chart!: ChartComponent;
  public Areachart: Partial<ChartOptions> | any;
  public Areachart2: Partial<ChartOptions> | any;
  public Areachart3: Partial<ChartOptions> | any;
  public Areachart4: Partial<ChartOptions> | any;
  public routes = routes;
  initChecked = false;
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  // pagination variables
  public pageSize = 10;
  public tableData: CompanyAccount[] = [];
  public tableDataCopy: CompanyAccount[] = [];
  public actualData: CompanyAccount[] = [];
  public currentPage = 1;
  public skip = 0;
  public limit: number = this.pageSize;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  public isLoading = false;
  public errorMessage = '';
  public pageSelection: pageSelection[] = [];
  dataSource!: MatTableDataSource<CompanyAccount>;
  public searchDataValue = '';
  public row=true;
  public password: boolean[] = [false,false,false,false];
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  constructor(
    private companyApiService: CompanyApiService,
    private router: Router,
    private pagination: PaginationService,
    private sidebar :SidebarService
  ) {

    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.superadminCompanies) {
        this.pageSize = res.pageSize;
        this.getTableData({ skip: res.skip, limit: res.limit });
      }
    });
  }
  private getTableData(pageOption: pageSelection): void {
    const page = Math.floor(pageOption.skip / this.pageSize);

    this.isLoading = true;
    this.errorMessage = '';

    this.companyApiService
      .list(page, this.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.tableData = [];
          this.tableDataCopy = [];
          this.actualData = [];
          this.serialNumberArray = [];
          this.totalData = response.totalElements;

          response.content.forEach((item: CompanyDto, index: number) => {
            const serialNumber = page * this.pageSize + index + 1;
            const row: CompanyAccount = {
              sNo: serialNumber,
              isSelected: false,
              CompanyName: item.name,
              Email: item.email ?? '-',
              AccountURL: item.accountUrl ?? '-',
              Plan: item.plan ?? '-',
              CreatedDate: item.createdAt ?? '-',
              Image: item.logoUrl ?? 'company-01.svg',
              Status: item.status ?? 'Active',
            };

            this.tableData.push(row);
            this.tableDataCopy.push(row);
            this.actualData.push(row);
            this.serialNumberArray.push(serialNumber);
          });

          this.dataSource = new MatTableDataSource<CompanyAccount>(this.actualData);
          this.pagination.calculatePageSize.next({
            totalData: this.totalData,
            pageSize: this.pageSize,
            tableData: this.tableData,
            tableDataCopy: this.tableDataCopy,
            serialNumberArray: this.serialNumberArray,
          });
        },
        error: (error) => {
          this.errorMessage = error?.message ?? 'Impossible de charger les entreprises.';
          this.tableData = [];
          this.tableDataCopy = [];
          this.actualData = [];
          this.dataSource = new MatTableDataSource<CompanyAccount>([]);
        },
      });
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
    this.Areachart = {
      series: [{
        name: "",
        data: [25, 66, 41, 12, 36, 9, 21]
      }],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0, // Start with 0 opacity (transparent)
          opacityTo: 0    // End with 0 opacity (transparent)
        }
      },
      chart: {
        foreColor: '#fff',
        type: "area",
        width: 50,
        toolbar: {
          show: !1
        },
        zoom: {
          enabled: !1
        },
        dropShadow: {
          enabled: 0,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      markers: {
        size: 0,
        colors: ["#F26522"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: !1
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#F26522"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      },
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },

        marker: {
          show: !1
        }
      }
    };
    this.Areachart2 = {
      series: [{
        name: "",
        data: [25, 40, 35, 20, 36, 9, 21]
      }],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0, // Start with 0 opacity (transparent)
          opacityTo: 0    // End with 0 opacity (transparent)
        }
      },
      chart: {
        foreColor: '#fff',
        type: "area",
        width: 50,
        toolbar: {
          show: !1
        },
        zoom: {
          enabled: !1
        },
        dropShadow: {
          enabled: 0,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      markers: {
        size: 0,
        colors: ["#F26522"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: !1
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#F26522"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      },
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },

        marker: {
          show: !1
        }
      }
    };
    this.Areachart3 = {
      series: [{
        name: "",
        data: [25, 10, 35, 5, 25, 28, 21]
      }],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0, // Start with 0 opacity (transparent)
          opacityTo: 0    // End with 0 opacity (transparent)
        }
      },
      chart: {
        foreColor: '#fff',
        type: "area",
        width: 50,
        toolbar: {
          show: !1
        },
        zoom: {
          enabled: !1
        },
        dropShadow: {
          enabled: 0,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      markers: {
        size: 0,
        colors: ["#F26522"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: !1
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#F26522"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      },
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },

        marker: {
          show: !1
        }
      }
    };
    this.Areachart4 = {
      series: [{
        name: "",
        data: [30, 40, 15, 23, 20, 23, 25]
      }],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0, // Start with 0 opacity (transparent)
          opacityTo: 0    // End with 0 opacity (transparent)
        }
      },
      chart: {
        foreColor: '#fff',
        type: "area",
        width: 50,
        toolbar: {
          show: !1
        },
        zoom: {
          enabled: !1
        },
        dropShadow: {
          enabled: 0,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      markers: {
        size: 0,
        colors: ["#F26522"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: !1
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#F26522"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      },
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },

        marker: {
          show: !1
        }
      }
    };
  }
}
