import { Injectable } from '@angular/core';
import { Chauffeur, IChauffeurResponse } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {
  GetChauffeurListSearch():Observable<IChauffeurResponse> {
    return new Observable(subscriber => {
      this.GetChauffeurList().subscribe(chauffeurs=>{
        subscriber.next({
          total: chauffeurs.length,
          results: chauffeurs
        });
      })
    });
  }

  constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) { }

  GetChauffeurById(id: any) {
    return this.afs.collection<Chauffeur>('chauffeur',ref=>ref.where(firestore.FieldPath.documentId(),'==',eval(id).toString())).snapshotChanges().pipe(
      map(action =>{
        return action.map(a =>{
          const data = a.payload.doc.data() as Chauffeur;
          const id = a.payload.doc.id;
          return {id, ...data };
        })
      })
    )
  }

	/* Cérer un Chauffeur */
	AddChauffeur(Chauffeur: Chauffeur){
		return this.afs.collection('chauffeur').doc(Chauffeur.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: Chauffeur.name.toUpperCase()
		})
	}

	/* Supprimer un Chauffeur */
	async DeleteChauffeur(id) {
		this.afs.doc('chauffeur/'+id).delete()
	}

	/* Retourne une liste des chauffeurs */
	GetChauffeurList() {
    return this.afs.collection<Chauffeur>('chauffeur',ref=> ref.orderBy('createdAt','asc'))
    .snapshotChanges()
    .pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Chauffeur;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}

	//Avoir le ID du dernier enregesitrement
	GetChauffeurLastRecord(){
	  return this.afs.collection('chauffeur', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier un Chauffeur */
	UpdateChauffeur(chauffeur:Chauffeur) {
		this.afs.doc('chauffeur/'+chauffeur.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: chauffeur.name.toUpperCase(),
			type_permis: chauffeur.type_permis.toUpperCase(),
			date_obtention: chauffeur.date_obtention,
			date_visite_yeux: chauffeur.date_visite_yeux
		})
	}
}
