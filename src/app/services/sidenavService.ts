import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Notification } from '../models/engin.model'
import { EnginService } from './engin.service';
import {AuthService} from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
    private sidenav: MatSidenav;

    constructor(public router: Router,private afs: AngularFirestore,private enginService: EnginService,private authService : AuthService) { }

    getNotificationByUser(role){
      return this.afs.collection<Notification>('notification',
          ref=>
          {
            let query : firebase.firestore.Query = ref
            if(role === 'admin'){
              query = query.where('etat','<=',5)
            }else{
              query = query.where('etat','<=',5).where('validation','==',firebase.auth().currentUser.uid)
            }
            return query
          }
          ).snapshotChanges().pipe(
            map(action=>{
              return action.map(a=>{
                const data = a.payload.doc.data() as Notification;
                const id = a.payload.doc.id;
                const lenght = a.payload.doc.data.length
                const engin_id = a.payload.doc.data().engin
                const user_uid = a.payload.doc.data().uid
                let engins = this.enginService.GetEnginListByIdArray([engin_id])
                let users = this.authService.user$(user_uid)
                return { id,lenght,engins,users, ...data };
              })
            })
          )
    }

     updateNotification(notification : Notification,etat:number){
      var notificationId = notification['id']
      var enginId = notification.engin
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
      .then(()=>{this.afs.doc('engin/'+notification.engin+'/notification/'+notification['id']).set(
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
