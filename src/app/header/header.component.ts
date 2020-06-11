import { Component, OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SidenavService } from './../services/sidenavService';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../services/user.service'
import { filter, switchMap } from 'rxjs/operators';
import { Roles } from '../models/engin.model';

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

  customStyle = {
    backgroundColor: '#F4F4F4',
    //border: '1px solid #bdc3c7',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer'
  };
  
  constructor(public authService: AuthService,private router : Router,
    private _bottomSheet: MatBottomSheet,private afs: AngularFirestore,public userService: UserService,
    private sidenavService: SidenavService,private firebaseAuth: AngularFireAuth) { 
    }

  toggleRightSidenav() {
      this.sidenavService.toggle();
  }  
  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
  ngOnInit() {                 
    this.user$ = this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.authService.user$(user.uid))
    )    
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
})
export class BottomSheetOverviewExampleSheet {
  photoUrl = "";
  name ="";
  email = "";
  uid = "";
  emailVerified:boolean;  
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>
    ,private firebaseAuth: AngularFireAuth) {}
  ngOnInit() {        
    var user = this.firebaseAuth.auth.currentUser
    this.name = user.displayName;
    this.email = user.email;
    this.photoUrl = user.photoURL;
    this.emailVerified = user.emailVerified;
    this.uid = user.uid;
  }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}