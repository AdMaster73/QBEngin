import { Component, OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SidenavService } from './../services/sidenavService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../services/user.service'
import { filter, switchMap, map } from 'rxjs/operators';
import { Roles, Notification, Engin } from '../models/engin.model';
import { async } from '@angular/core/testing';
import { EnginService } from '../services/engin.service';
import { MatSnackBar } from '@angular/material';
import { User } from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  outputs:['navToggle']
})
export class HeaderComponent implements OnInit {

  title = "GCR Materiel";
  emailVerified : boolean;
  user$: Observable<{}>;
  roles$: Observable<Roles>
  listNotification : Observable <{}>
  countNot : number

  customStyle = {
    backgroundColor: '#F4F4F4',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer'
  };

  constructor(
    public authService: AuthService,
    private router : Router,
    private _bottomSheet: MatBottomSheet,
    public userService: UserService,
    private sidenavService: SidenavService,
    private firebaseAuth: AngularFireAuth) {
    }

  toggleRightSidenav() {
      this.sidenavService.toggle();
  }
  openBottomSheet(): void {

    if(this.countNot == 0){
      return
    }
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
  ngOnInit() {
    this.user$ = this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.authService.user$(user.uid))
    )

    this.listNotification = this.sidenavService.getNotificationByUser()

    this.sidenavService.getNotificationByUser().subscribe(results=>{
      this.countNot = results.length
    })
  }

  onSignOut() {
    this.authService.signOutUser();
    this.router.navigate(['/auth','signin'])
  }

  onSignUp(){
    this.router.navigate(['/sidenav','user']);
  }
  avatarClicked(event: any) {
    alert('click on avatar fetched from ' + event.sourceType);
  }

}

@Component({
  selector: 'bottom-sheet-overview-avatar-sheet',
  templateUrl: 'bottom-sheet-overview-avatar-sheet.html',
  styles:[`:host /deep/ .mat-list-item:hover .mat-icon-button {
                display: block;
              }
              :host /deep/ .mat-icon-button {
                display: none;
              }
              :host /deep/ .mat-line {
                font-size: smaller !important;
              }
`]
})
export class BottomSheetOverviewExampleSheet {
  listNotification : Observable <Notification[]>
  engins: Observable<Engin[]>
  user$: Observable<{}>;
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>
    ,private sidenaveService: SidenavService,
    private firebaseAuth: AngularFireAuth,
    private enginService:EnginService,
    public authService: AuthService,
    private _snackBar: MatSnackBar) {
    }
  ngOnInit() {
    this.listNotification = this.sidenaveService.getNotificationByUser()
    this.user$ = this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.authService.user$(user.uid))
    )
  }

  getEnginByID(engin){
    return this.enginService.getEnginById(engin)
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  wait(notification: Notification) {
    this._snackBar.open(notification.type + ' est mise en attente !!!! ', 'Ok', {
      duration: 5000,
    });
  }
  validate(notification: Notification) {
    this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.authService.user$(user.uid))
    ).subscribe(user=>{
      this._snackBar.open(notification.type + ' est validée !!!! ', 'Ok', {
        duration: 5000,
      });
      console.log(notification["id"])
    })
  }
  delete(notification: Notification) {
    this._snackBar.open(notification.type + ' est refusée !!!! ', 'Ok', {
      duration: 5000,
    });
  }
  archive(notification: Notification) {
    this._snackBar.open(notification.type + ' est archivée !!!! ', 'Ok', {
      duration: 5000,
    });
  }
}
