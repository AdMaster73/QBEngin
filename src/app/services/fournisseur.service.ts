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

	constructor(private afs: AngularFirestore) {}

	/* Cérer un Fournisseur */
	AddFournisseur(Fournisseur: Fournisseur){		
		return this.afs.collection('fournisseur').doc(Fournisseur.id.toString()).set({
			createdAt: firestore.FieldValue.serverTimestamp(),       
			name: Fournisseur.name		
		})
	}
	
	/* Supprimer un Fournisseur */
	async DeleteFournisseur(id) {
		this.afs.doc('fournisseur/'+id).delete()
	}

	/* Retourne une liste des fournisseurs */
	GetFournisseurList() {		
		return this.afs.collection<Fournisseur>('fournisseur',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Fournisseur;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);	
	}
	
	//Avoir le ID du dernier enregesitrement
	GetFournisseurLastRecord(){		
	  return this.afs.collection('fournisseur', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )				
	}
	
	/* Modifier un Fournisseur */
	UpdateFournisseur(id, Fournisseur) {  		
		this.afs.doc('fournisseur/'+id).update({name: Fournisseur.name})														
	} 
}
