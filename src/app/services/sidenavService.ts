import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { firestore, User } from 'firebase';
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
      ref=>ref.where('first_validation','==',firebase.auth().currentUser.uid).where('etat','==',1)
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

     updateNotification(notification : Notification,etat:number){
      var notificationId = notification['id']
      var enginId = notification.engin.id
      switch (etat) {
        case 2://dans le cas ou la validation est normale "1er validation par le charger ou le conducteur du chantier provenance"
          this.afs.doc('notification/'+notificationId).set({
            etat : etat
          },{merge:true}).then(()=>{
            this.afs.doc('engin/'+enginId).set({
              last_notified : etat
            },{merge:true})
          }).then(()=>{
            this.afs.doc('engin/'+enginId+'notification/'+notificationId).set({
              etat : etat
            },{merge:true})
          }).then(()=>
            {
              this.afs.doc('notification/'+notificationId+'/story').set({
                updatedAt:firestore.FieldValue.serverTimestamp(),
                updatedBy:notification.first_validation[0].uid,
                etat:etat
              },{merge:true})
            }
          )
          break;

        case 3://dans le cas ou la validation est normale "2ème validation par le dex ou dtu du chnatier provenance"
          this.afs.doc('notification/'+notificationId).set({
            etat : etat
          },{merge:true}).then(()=>{
            this.afs.doc('engin/'+enginId).set({
              last_notified : etat
            },{merge:true})
          }).then(()=>{
            this.afs.doc('engin/'+enginId+'notification/'+notificationId).set({
              etat : etat
            },{merge:true})
          }).then(()=>
          {
            this.afs.doc('notification/'+notificationId+'/story').set({
              updatedAt:firestore.FieldValue.serverTimestamp(),
              updatedBy:notification.second_validation[0].uid,
              etat:etat
            },{merge:true})
          }
        )
          break;

        case 4://dans le cas ou la validation est normale "3ème validation par le dex ou dtu du chantier destination"
          this.afs.doc('notification/'+notificationId).set({
            etat : etat
          },{merge:true}).then(()=>{
            this.afs.doc('engin/'+enginId).set({
              last_notified : etat
            },{merge:true})
          }).then(()=>{
            this.afs.doc('engin/'+enginId+'notification/'+notificationId).set({
              etat : etat
            },{merge:true})
          }).then(()=>
          {
            this.afs.doc('notification/'+notificationId+'/story').set({
              updatedAt:firestore.FieldValue.serverTimestamp(),
              updatedBy:notification.dex_dtu[0].uid,
              etat:etat
            },{merge:true})
          }
        )
          break;

        default:
          break;
      }


    }


    deleteNotification(notification:Notification,user:firebase.User){
      return this.afs.doc('notification/'+notification['id']).set(
        {deletedBy : user.uid,deletedAt:firestore.FieldValue.serverTimestamp()},{merge:true})
      .then(()=>{this.afs.doc('engin/'+notification.engin.id+'/notification/'+notification['id']).set(
        {deletedBy : user.uid,deletedAt:firestore.FieldValue.serverTimestamp()},{merge:true})})
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
