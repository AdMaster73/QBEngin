import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SidenavService } from './../services/sidenavService';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent  implements AfterViewInit{
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    opened: boolean;
    shouldShow = true;
    toggle() { this.shouldShow = !this.shouldShow; }       
  @ViewChild('sidenavNotification',{'static':false}) public sidenav: MatSidenav 
  constructor(private breakpointObserver: BreakpointObserver,
    private sidenavService: SidenavService,
    public router: Router) {}
    ngAfterViewInit(): void {
      this.sidenavService.setSidenav(this.sidenav);      
      //this.router.navigate(['/sidenav']);
    }    
    
}
