import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { Chantier, Transfert,Engin,Etat_engin_Transfert } from '../models/engin.model';
declare var require: any;
const firebase = require('firebase')

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  constructor(private afs: AngularFirestore) {}
  getTransfertEnCours(){    
    return this.afs.collection<Transfert>('transfert',ref=>{        
      let query : firebase.firestore.Query = ref      
      query = query.where('arrived','==',false)
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
