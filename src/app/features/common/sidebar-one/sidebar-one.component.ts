import { Component } from '@angular/core';

import { NavigationEnd, NavigationStart, Router, Event as RouterEvent, RouterLink, RouterLinkActive } from '@angular/router';
import { routes, SidebarService } from '../../../core/core.index';
import { menu, sidebarData, sidebarDataone, url } from '../../../shared/model/sidebar.model';
import { CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';


interface MenuItem {
  menuValue: string;
  showSubRoute: boolean;
  menu: SubMenu[];
}

interface SubMenu {
  menuValue: string;
  showSubRoute: boolean;
}


@Component({
    selector: 'app-sidebar-one',
    templateUrl: './sidebar-one.component.html',
    styleUrls: ['./sidebar-one.component.scss'],
    imports: [RouterLink,CommonModule,NgScrollbar,RouterLinkActive],
})
export class SidebarOneComponent {
  routes = routes;
  base = '';
  page = '';
  currentUrl = '';


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public side_bar_data: Array<any> = [];

  constructor(
    private Router: Router,
    private sidebar: SidebarService,
    private router: Router
  ) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
    this.side_bar_data = this.sidebar.sidebarData1;
  }

  private getRoutes(route: url): void {
    const splitVal = route.url.split('/');
    this.currentUrl = route.url;
    this.base = splitVal[1];
    this.page = splitVal[2];
  }

  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sidebar.expandSideBar.next(true);
    } else {
      this.sidebar.expandSideBar.next(false);
    }
  }

    public expandSubMenus(menu: { menuValue: string; showSubRoute: boolean; }): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: MenuItem) => {

      mainMenus.menu.map((resMenu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue == menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
  isOpen=false;
  public expandSubMenusActive(): void {
    const activeMenu = sessionStorage.getItem('menuValue'); // Was 'base' — changed to 'menuValue'
  
    if (!Array.isArray(this.side_bar_data)) {
      console.warn('side_bar_data is not initialized');
      return;
    }
  
    this.side_bar_data.forEach((mainMenu: any) => {
      if (!Array.isArray(mainMenu.menu)) return;
  
      mainMenu.menu.forEach((resMenu: any) => {
        if (activeMenu) {
          // Show only the menu matching the stored menuValue
          resMenu.showSubRoute = (resMenu.menuValue === activeMenu);
        } else {
          // No session value: Show only 'index' base routes
          resMenu.showSubRoute = (resMenu.base === 'dashboard');
        }
      });
    });
  
    this.isOpen = !activeMenu;
  }
  openMenu(menu: any): void {
    if (this.openMenuItem === menu) {
      this.openMenuItem = null;
    } else {
      this.openMenuItem = menu;
    }
  }
  openSubmenuOne(subMenus: any): void {
    if (this.openSubmenuOneItem === subMenus) {
      this.openSubmenuOneItem = null;
    } else {
      this.openSubmenuOneItem = subMenus;
    }
  }

  openMenuItem: MenuItem | null = null;
  openSubmenuOneItem: SubMenu[] | null = null;
  multiLevel1 = false;
  multiLevel2 = false;
  multiLevel3 = false;

  

  multiLevelOne() {
    this.multiLevel1 = !this.multiLevel1;
    this.multiLevel2 = false;
    this.multiLevel3 = false;
  }
  multiLevelTwo() {
    this.multiLevel2 = !this.multiLevel2;
    this.multiLevel3 = false;
  }
  multiLevelThree() {
    this.multiLevel3 = !this.multiLevel3;
  }
  public toggleSidebar(): void {
    this.sidebar.switchSideMenuPosition();
  }
  ngOnInit(): void {

  if(this.page === 'index'){
    this.expandSubMenusActive();
  }
  this.isOpen =false;
  
}
}
