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
		 
	/* Créer un nouveau chantier */
	AddChantier(chantier: Chantier){		
		return this.afs.collection('chantier').doc(chantier.id.toString()).set({      
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),	    
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
	
	//Avoir le ID du dernier enregesitrement
	GetChantierLastRecord(){		
	  return this.afs.collection('chantier', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )				
	}
	
	/* Modifier un chantier */
	UpdateChantier(chantier) {  		
		this.afs.doc('chantier/'+chantier.id).update(
			{
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(), 
			name: chantier.name.toUpperCase(),
			compte:chantier.compte,
			archive:chantier.archive,				
			}
		)														
	}  
}
