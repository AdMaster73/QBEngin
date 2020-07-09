import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Notification } from '../models/engin.model'

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
    private sidenav: MatSidenav;

    constructor(public router: Router,private afs: AngularFirestore) { }

    getNotificationByUser(){
      return this.afs.collection<Notification>('notification',
      ref=>ref.where('uid','==',firebase.auth().currentUser.uid)
      ).snapshotChanges().pipe(
        map(action=>{
          return action.map(a=>{
            const data = a.payload.doc.data() as Notification;
            const id = a.payload.doc.id;
            const lenght = a.payload.doc.data.length
            return { id,lenght, ...data };
          })
        })
      )
    }

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public open() {
        return this.sidenav.open();
    }


    public close() {
        return this.sidenav.close();
    }

    public toggle(): void {
      this.sidenav.toggle();
   }


}
