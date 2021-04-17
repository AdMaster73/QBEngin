import { Injectable } from '@angular/core';
import { Mouvements } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable({
  providedIn: 'root'
})
export class MouvementsService {

  constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) { }

  	/* Retourn une liste des categories */
    GetMouvementsList() {
    return this.afs.collection('charges').doc(new Date().getFullYear().toString()).collection<Mouvements>('mouvements')
    .snapshotChanges()
    .pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Mouvements;
        const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}

  getAllMouvements(){
    return this.afs.collection('charges').snapshotChanges()
    .pipe(
      map(actions=>{
        return actions.map(a=>{
          const id = a.payload.doc.id
          const data = a.payload.doc.data() as any
          return {id, ...data}
        })
      })
    )
  }

  fetchMouvementsByYear(year:string){
    return this.afs.collection('charges').doc(year).collection<Mouvements>('mouvements')
    .snapshotChanges()
    .pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Mouvements;
        const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
  }

}
