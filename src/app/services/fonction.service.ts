import { Injectable } from '@angular/core';
import { Fonction, IFonctionResponse } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FonctionService {

	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) {}
	/* Créer une nouvelle Fonction */
	AddFonction(fonction: Fonction){
		return this.afs.collection('fonction').doc(fonction.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: fonction.name.toUpperCase()
		})
  }

  GetFonctionListSearch():Observable<IFonctionResponse> {
    return new Observable(subscriber => {
      this.GetFonctionList().subscribe(fonctions=>{
        subscriber.next({
          total: fonctions.length,
          results: fonctions
        });
      })
    });
}

	/* Supprimer la Fonction */
	async DeleteFonction(id) {
		this.afs.doc('fonction/'+id).delete()
	}

	/* Retourn une liste des Fonctions */
	GetFonctionList() {
    return this.afs.collection<Fonction>('fonction',ref=> ref.orderBy('createdAt','asc'))
    .snapshotChanges()
    .pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Fonction;
        const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}

	//Retourne le ID du dernier enregistrement
	GetFonctionLastRecord(){
	  return this.afs.collection('fonction', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier la Fonction */
	UpdateFonction(fonction) {
		this.afs.doc('fonction/'+fonction.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: fonction.name.toUpperCase()
		})
	}
}
