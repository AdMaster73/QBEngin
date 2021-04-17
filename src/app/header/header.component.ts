import { Component, Inject, OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SidenavService } from './../services/sidenavService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../services/user.service'
import { filter, switchMap, map } from 'rxjs/operators';
import { Roles, Notification, Engin } from '../models/engin.model';
import { async } from '@angular/core/testing';
import { EnginService } from '../services/engin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';

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
  countNot : number = 0

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
  openBottomSheet(notifications,role): void {

    if(this.countNot == 0){
      return
    }
    this._bottomSheet.open(BottomSheetOverviewExampleSheet,{
      data: {
        notification: notifications,
        role:role
      }
    });
  }
  ngOnInit() {
    this.user$ = this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.authService.user$(user.uid))
    );

    (async () => {
      let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
      this.listNotification = this.sidenavService.getNotificationByUser(roleCurrentUser)

      this.sidenavService.getNotificationByUser(roleCurrentUser).subscribe(results=>{
        this.countNot = results.length
      })

    })();

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
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,
    private sidenaveService: SidenavService,
    private firebaseAuth: AngularFireAuth,
    private enginService:EnginService,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    }
  ngOnInit() {

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
  validate(notification: Notification) {
    if(notification.etat == 5){
      this.enginService.getEnginById(notification.engin).subscribe(engins=>{
        engins.forEach(engin => {
          this.sidenaveService.updateNotification(notification,eval(notification.etat.toString()),engin)
        });
      })
    }else{
          this.sidenaveService.updateNotification(notification,eval(notification.etat.toString()))
    }
  }
  delete(notification: Notification) {
    this.sidenaveService.deleteNotification(notification)
  }
}
