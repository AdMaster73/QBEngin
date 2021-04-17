import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, from, zip, pipe, Observer, combineLatest } from 'rxjs';
import { map, shareReplay, filter, switchMap } from 'rxjs/operators';
import { SidenavService } from './../services/sidenavService';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { RolesService } from '../services/roles.service';
import { Collections, Roles } from '../models/engin.model';
import * as firebase from 'firebase';
import { firestore } from 'firebase';
import { admin } from 'firebase-admin/lib/database';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent  implements AfterViewInit, OnInit{

  user$: Observable<{}>;
  collections$ : Observable<Collections[]>;
  roleUser: string[]=[];
  roleCurrentUser:string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    opened: boolean;
    shouldShow = true;
    toggle() { this.shouldShow = !this.shouldShow; }
  @ViewChild('sidenavNotification') public sidenav: MatSidenav
  constructor(
    private breakpointObserver: BreakpointObserver,
    private afs: AngularFirestore,
    private rolesService:RolesService,
    private firebaseAuth: AngularFireAuth,
    private sidenavService: SidenavService,
    private authService: AuthService,
    public router: Router) {
      (async () => {
          this.roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
          this.collections$ = new Observable((observer: Observer<Collections[]>) => {
          this.rolesService.getRolesByNameAndType(this.roleCurrentUser).subscribe(roles=>{
            roles.forEach(item=>{
              if(this.roleCurrentUser == "admin"){
                this.afs
                .collection<Collections>('collections').valueChanges()
                .subscribe(result=>{
                  observer.next(result.sort((a,b)=>a.order - b.order))
                })
              }else{
                this.afs
                .collection<Collections>('collections',ref=>ref.where(firestore.FieldPath.documentId(),'in',item.list)).valueChanges()
                .subscribe(result=>{
                  observer.next(result.sort((a,b)=>a.order - b.order))
                })
              }
            })
          })
        })
      })();
    }
  ngOnInit(){
    this.user$ = this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.authService.user$(user.uid))
    )

  }
    ngAfterViewInit(): void {
      this.sidenavService.setSidenav(this.sidenav);
    }

}
