import { Injectable } from '@angular/core';
import { Chantier } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class ChantierService {

	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) {}

  /**Récuperer le chantier par utilisateur */

  getChantierByUser(){
    return this.afs.collection('chantier',ref=>ref.where('users','array-contains',this.firebaseAuth.auth.currentUser.uid)).snapshotChanges().pipe(
      map(action =>{
        return action.map(a =>{
          const data = a.payload.doc.data() as Chantier;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

	/* Créer un nouveau chantier */
	AddChantier(chantier: Chantier){
		return this.afs.collection('chantier').doc(chantier.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: chantier.name,
			compte:chantier.compte,
			archive:chantier.archive,
		})
	}

	/* Supprier un chantier */
	async DeleteChantier(id) {
		this.afs.doc('chantier/'+id).delete()
	}

	/*Retourner une liste des chantier */
	GetChantierList() {
		return this.afs.collection<Chantier>('chantier',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Chantier;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}

	/*Retourner une liste des chantier non archivées*/
	GetChantierListNnArchived() {
		return this.afs.collection<Chantier>('chantier',ref=> ref.where('archive','==',0)).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Chantier;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}

	//Avoir le ID du dernier enregesitrement
	GetChantierLastRecord(){
	  return this.afs.collection('chantier', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier un chantier */
	UpdateChantier(chantier) {
    let archive:number
		if(typeof(chantier.archive)==='number'){
			archive = chantier.archive
		}else{
			!!chantier.archive ? archive = 1 : archive = 0
		}
		this.afs.doc('chantier/'+chantier.id).update(
			{
			uodatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: chantier.name.toUpperCase(),
			compte:chantier.compte,
			archive:archive,
			region:chantier.region
			}
		)
	}
}
