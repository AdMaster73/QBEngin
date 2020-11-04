import { Injectable } from '@angular/core';
import { Fournisseur, IFournisseurResponse } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) {}

  GetFournisseurListSearch():Observable<IFournisseurResponse>  {
    return new Observable(subscriber => {
      this.GetFournisseurList().subscribe(fournisseurs=>{
        subscriber.next({
          total: fournisseurs.length,
          results: fournisseurs
        });
      })
    });
  }
	/* Cérer un Fournisseur */
	AddFournisseur(Fournisseur: Fournisseur){
		return this.afs.collection('fournisseur').doc(Fournisseur.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
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
	UpdateFournisseur(fournisseur) {
		this.afs.doc('fournisseur/'+fournisseur.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: fournisseur.name.toUpperCase(),
			compte: fournisseur.compte
		})
	}
}
