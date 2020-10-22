import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Notification, Transfert } from '../models/engin.model';
import { AuthService } from './auth.service';
import { EnginService } from './engin.service';
declare var require: any;
const firebase = require('firebase')

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  constructor(private afs: AngularFirestore,private enginService : EnginService,private auth : AuthService) {}
  getTransfertEnCours(){
    return this.afs.collection<Notification>('notification',ref=>{
      let query : firebase.firestore.Query = ref
      query = query.where('etat','<',6)
      return query
    }).snapshotChanges().pipe(map(action=>{
      return action.map(a=>{
        const id = a.payload.doc.id
        const data = a.payload.doc.data() as Notification
        const engin_id = a.payload.doc.data().engin
        const user_uid = a.payload.doc.data().uid
        const user_uid_validation = a.payload.doc.data().validation
        let engins = this.enginService.GetEnginListByIdArray([engin_id])
        let users = this.auth.user$(user_uid)
        let users_validation = this.auth.user$(user_uid_validation)
        return {id,engins,users,users_validation, ...data}
      })
    }))
  }
  getTransfertHistorique(){
    return this.afs.collection<Transfert>('notification',ref=>{
      let query : firebase.firestore.Query = ref
      query = query.where('etat','>=',6)
      return query
    }).snapshotChanges().pipe(map(action=>{
      return action.map(a=>{
        const id = a.payload.doc.id
        const data = a.payload.doc.data() as Transfert
        return {id, ...data}
      })
    }))
  }
}
