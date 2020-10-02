import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { flatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { Chantier, Engin, Pointage, User } from '../models/engin.model';
import { AuthService} from '../services/auth.service';
import { Observable, combineLatest, of } from 'rxjs';
declare var require: any;
const firebase = require('firebase')


@Injectable({
  providedIn: 'root'
})
export class PointageService {

  constructor(private afs: AngularFirestore,private authService:AuthService,
		private firebaseAuth: AngularFireAuth) {
    }
     getPointageByEngin(engin: Engin) {

      return this.afs.collection<Pointage>('engin/'+engin.id+'/pointage').snapshotChanges().pipe(
        switchMap((pointages)=>{
          const point = pointages.map(p=>{
            return this.authService.user$(p.payload.doc.data().uid)
            .pipe(
              map(users=>Object.assign(p.payload.doc.data(),{users}))
            )
          })
          return combineLatest(...point)
        }
        )
      )
    }

    getChantierByUser(){
      return this.afs.collection<Chantier>('chantier',ref=>{
        const id = this.firebaseAuth.auth.currentUser.uid
        let query : firebase.firestore.Query = ref
        query = query.where('users','array-contains',id)
        return query
      }).snapshotChanges().pipe(map(action=>{
        return action.map(a=>{
          const id = a.payload.doc.id
          const data = a.payload.doc.data() as Chantier
          return {id, ...data}
        })
      }))
    }
    getAllChantierActive(){
      return this.afs.collection<Chantier>('chantier',ref=>{
        let query : firebase.firestore.Query = ref
        query = query.where('archive','==',0)
        return query
      }).snapshotChanges().pipe(map(action=>{
        return action.map(a=>{
          const id = a.payload.doc.id
          const data = a.payload.doc.data() as Chantier
          return {id, ...data}
        })
      }))
    }

}
