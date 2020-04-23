import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Fournisseur } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireObject, AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

	FournisseurRef: AngularFireObject<any>;
	item: Observable<any>;
	offset = new Subject<string>();		
	constructor(
    private db: AngularFireDatabase,
		 private afs: AngularFirestore) {
			this.FournisseurRef = db.object('Fournisseur');
			this.item = this.FournisseurRef.valueChanges();
		 }
	/* Create Fournisseur */
	AddFournisseur(Fournisseur: Fournisseur){		
		return this.afs.collection('Fournisseur').doc(Fournisseur.id.toString()).set({
			createdAt: firestore.FieldValue.serverTimestamp(),       
			name: Fournisseur.name		
		})
	}
	
	/* Delete Fournisseur */
	async DeleteFournisseur(id) {
		this.afs.doc('Fournisseur/'+id).delete()
	}

	/* Get engin list */
	GetFournisseurList() {		
		return this.afs.collection<Fournisseur>('Fournisseur',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Fournisseur;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);	
	}
	
	//get the last record from Fournisseur for incemanting
	GetFournisseurLastRecord(){		
	  return this.afs.collection('Fournisseur', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )				
	}
	
	/* Update Fournisseur */
	UpdateFournisseur(id, Fournisseur) {  		
		this.afs.doc('Fournisseur/'+id).update({name: Fournisseur.name})														
	} 
}
