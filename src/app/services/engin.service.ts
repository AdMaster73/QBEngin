import { Injectable } from '@angular/core';
import { Engin } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class EnginService {
		
	constructor(private afs: AngularFirestore) {}
		 
	/* Créer un nouveau engin */
	AddEngin(engin: Engin){		
		return this.afs.collection('engin').doc(engin.id.toString()).set({
			createdAt: firestore.FieldValue.serverTimestamp(),       
			code: engin.code,
			name: engin.name,
			date_achat:engin.date_achat,
			valeur_achat: engin.valeur_achat,
			n_serie: engin.n_serie,
			marque_moteur: engin.marque_moteur,
			serie_moteur: engin.serie_moteur,
			categorie:{
				id :engin.categorie.id,
				name:engin.categorie.name
			},
			fournisseur:{
				id :engin.fournisseur.id,
				name:engin.fournisseur.name
			}			
		})
	}

	/* Supprier un engin */
	async DeleteEngin(id) {
		this.afs.doc('engin/'+id).delete()
	}
	
	/*Retourner une liste des engin */
	GetEnginList() {		
		return this.afs.collection<Engin>('engin',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Engin;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);	
	}
	
	//Avoir le ID du dernier enregesitrement
	GetEnginLastRecord(){		
	  return this.afs.collection('engin', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )				
	}
	
	/* Modifier un engin */
	UpdateEngin(id, engin) {  		
		this.afs.doc('engin/'+id).update(
			{
				code: engin.code,
				name: engin.name,
				date_achat: engin.date_achat,
				valeur_achat: engin.valeur_achat,
				n_serie: engin.n_serie,
				marque_moteur: engin.marque_moteur,
				serie_moteur: engin.serie_moteur,			
				categorie:{
					id:engin.id_categorie,
					name:engin.categorie
				},
				fournisseur:{
					id:engin.id_fournisseur,
					name:engin.fournisseur
				}			
			}
		)														
	}    
}
