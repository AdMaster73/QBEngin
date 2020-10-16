import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Transfert } from '../models/engin.model';
declare var require: any;
const firebase = require('firebase')

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  constructor(private afs: AngularFirestore) {}
  getTransfertEnCours(){
    return this.afs.collection<Transfert>('notification',ref=>{
      let query : firebase.firestore.Query = ref
      query = query.where('etat','<',6)
      return query
    }).snapshotChanges().pipe(map(action=>{
      return action.map(a=>{
        const id = a.payload.doc.id
        const data = a.payload.doc.data() as Transfert
        return {id, ...data}
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
