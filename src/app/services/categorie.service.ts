import { Injectable } from '@angular/core';
import { Categorie } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
		
	constructor(private afs: AngularFirestore) {}
	/* Créer une nouvelle Categorie */
	AddCategorie(categorie: Categorie){		
		return this.afs.collection('categorie').doc(categorie.id.toString()).set({
			createdAt: firestore.FieldValue.serverTimestamp(),       
			name: categorie.name		
		})
	}
	
	/* Supprimer la categorie */
	async DeleteCategorie(id) {
		this.afs.doc('categorie/'+id).delete()
	}

	/* Retourn une liste des categories */
	GetCategorieList() {		
		return this.afs.collection<Categorie>('categorie',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Categorie;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);	
	}
	
	//Retourne le ID du dernier enregistrement
	GetCategorieLastRecord(){		
	  return this.afs.collection('categorie', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )				
	}
	
	/* Modifier la categorie */
	UpdateCategorie(id, categorie) {  		
		this.afs.doc('categorie/'+id).update({
			name: categorie.name.toUpperCase(),
			compte: categorie.compte.toUpperCase()
		})														
	} 

}
