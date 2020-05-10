import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatSidenav} from '@angular/material';
import { SidenavService } from './../services/sidenavService';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/User.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  outputs:['navToggle']
})
export class HeaderComponent implements OnInit {  
  isAuth: boolean;
  isAdmin: boolean;
  photoUrl = "";
  name ="";
  email = "";
  uid = "";
  title = "GCR Materiel";
  emailVerified : boolean;

  customStyle = {
    backgroundColor: '#27ae60',
    //border: '1px solid #bdc3c7',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer'
  };
  
  constructor(private authService: AuthService,private router : Router,
    private _bottomSheet: MatBottomSheet,private afs: AngularFirestore,
    private sidenavService: SidenavService) { 
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${firebase.auth().currentUser.uid}`)
      userRef.snapshotChanges().subscribe(actions =>{
        if(actions.payload.data().roles.admin){      
          this.isAdmin = true  
        }else{
          this.isAdmin = false      
        }                   
      })             
    }

  toggleRightSidenav() {
      this.sidenavService.toggle();
  }  
  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
  ngOnInit() {      
    firebase.auth().onAuthStateChanged(
      (user) => {        
        if(user) {        
          var user = firebase.auth().currentUser;
          this.isAuth = true;
          this.name = user.displayName;
          this.email = user.email;
          this.photoUrl = user.photoURL;
          this.emailVerified = user.emailVerified;
          this.uid = user.uid;          
        } else {
          this.isAuth = false;
          this.router.navigate(['/auth','signin']);
        }
      }
    );
  }

  onSignOut() {
    this.authService.signOutUser();
    this.router.navigate(['/auth','signin']);
  }

  onSignUp(){
    this.router.navigate(['/sidenav','signUp']);
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
  emailVerified = "";  
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}
  ngOnInit() {    
    firebase.auth().onAuthStateChanged(
      (user) => {        
        if(user) {        
          var user = firebase.auth().currentUser;
          this.name = user.displayName;
          this.email = user.email;
          this.photoUrl = user.photoURL;
          this.uid = user.uid;          
        }
      }
    );
  }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}