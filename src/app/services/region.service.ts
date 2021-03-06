import { Injectable } from '@angular/core';
import { Chantier, Region } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { ChantierService } from './chantier.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth,private chantierService:ChantierService) {}
	/* Créer une nouvelle Region */
	AddRegion(region: Region){
		return this.afs.collection('region').doc(region.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: region.name
		})
	}

	/* Supprimer la region */
	async DeleteRegion(id) {
		this.afs.doc('region/'+id).delete()
	}

	/* Retourn une liste des regions */
	GetRegionList() {
		return this.afs.collection<Region>('region',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Region;
        const id = a.payload.doc.id;
        const name = a.payload.doc.data().name
        let sites = this.chantierService.getChantierByRegion(name)
				return {id, ...data,sites}
			});
			})
    );
  }


	//Retourne le ID du dernier enregistrement
	GetRegionLastRecord(){
	  return this.afs.collection('region', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier la region */
	UpdateRegion(region) {
		this.afs.doc('region/'+region.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: region.name.toUpperCase(),
			compte: region.compte.toUpperCase()
		})
	}
}
