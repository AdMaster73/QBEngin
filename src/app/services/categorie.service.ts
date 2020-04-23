import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Categorie } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireObject, AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
		
	categorieRef: AngularFireObject<any>;
	item: Observable<any>;
	offset = new Subject<string>();		
	constructor(
    private db: AngularFireDatabase,
		 private afs: AngularFirestore) {
			this.categorieRef = db.object('categorie');
			this.item = this.categorieRef.valueChanges();
		 }
	/* Create Categorie */
	AddCategorie(categorie: Categorie){		
		return this.afs.collection('categorie').doc(categorie.id.toString()).set({
			createdAt: firestore.FieldValue.serverTimestamp(),       
			name: categorie.name		
		})
	}
	
	/* Delete categorie */
	async DeleteCategorie(id) {
		this.afs.doc('categorie/'+id).delete()
	}

	/* Get engin list */
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
	
	//get the last record from categorie for incemanting
	GetCategorieLastRecord(){		
	  return this.afs.collection('categorie', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )				
	}
	
	/* Update categorie */
	UpdateCategorie(id, categorie) {  		
		this.afs.doc('categorie/'+id).update({name: categorie.name})														
	} 

}
