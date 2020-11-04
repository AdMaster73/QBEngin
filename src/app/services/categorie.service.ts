import { Injectable } from '@angular/core';
import { Categorie, ICategorieResponse } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) {}
	/* Créer une nouvelle Categorie */
	AddCategorie(categorie: Categorie){
		return this.afs.collection('categorie').doc(categorie.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: categorie.name
		})
  }

  GetCategorieListSearch():Observable<ICategorieResponse> {
    return new Observable(subscriber => {
      this.GetCategorieList().subscribe(categories=>{
        subscriber.next({
          total: categories.length,
          results: categories
        });
      })
    });
}

	/* Supprimer la categorie */
	async DeleteCategorie(id) {
		this.afs.doc('categorie/'+id).delete()
	}

	/* Retourn une liste des categories */
	GetCategorieList() {
    return this.afs.collection<Categorie>('categorie',ref=> ref.orderBy('createdAt','asc'))
    .snapshotChanges()
    .pipe(
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
	UpdateCategorie(categorie) {
		this.afs.doc('categorie/'+categorie.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: categorie.name.toUpperCase(),
			compte: categorie.compte
		})
	}

}
