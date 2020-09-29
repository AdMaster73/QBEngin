import { Injectable } from '@angular/core';
import { Collections, Roles } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Role } from '../models/User.model';
import { RolesService } from '../services/roles.service'
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor(private afs: AngularFirestore,
	private rolesServices: RolesService,
	private authService : AuthService,
	private firebaseAuth: AngularFireAuth
	) { }

  addCollectionsRoles(id,roles:Roles){
	this.afs.doc('/collections/'+id).update({
		list:firebase.firestore.FieldValue.arrayUnion(roles.id)
	})
  }
  deleteCollectionsRoles(id,roles:Roles){
	const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
	this.afs.doc('/collections/'+id).update({
		list:arrayRemove(
			roles.id
		)
	})
  }
	/* Cérer un Collections */
	AddCollections(Collections: Collections){
		return this.afs.collection('collections').doc(Collections.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: Collections.name,
			intitule:Collections.intitule,
			toolTipe:Collections.toolTipe,
			icon:Collections.icon
		})
	}

	/* Supprimer un Collections */
	async DeleteCollections(id) {
		this.afs.doc('collections/'+id).delete()
	}

	/* Retourne une liste des collectionss */
	GetCollectionsList() {
		return this.afs.collection<Collections>('collections',ref=> ref.orderBy('order','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Collections;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}
/* Retourne une collection par Id */
GetCollectionsByName(name:string) {
	return this.afs.collection<Collections>('collections/',ref=>ref.where('name','==',name)).snapshotChanges().pipe(
		map(actions => {
		return actions.map(a => {
			const data = a.payload.doc.data() as Collections;
			const id = a.payload.doc.id;
			return { id, ...data };
		});
		})
	);
}
	listCollectionsUser():Observable<any[]>{
		return combineLatest(
			this.afs.doc('collections').valueChanges(),
			this.authService.users$
		).pipe(
			map(([collection,users])=>{
				if(collection['list'] === undefined){
					return []
				}
				return users.filter(user=>collection['list'].includes(user.uid))
			}))
	}

	//Avoir le ID du dernier enregesitrement
	GetCollectionsLastRecord(){
	  return this.afs.collection('collections', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier un Collections */
	UpdateCollections(collections) {
		this.afs.doc('collections/'+collections.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: collections.name,
			intitule:collections.intitule,
			toolTipe:collections.toolTipe,
			icon:collections.icon,
			order:collections.order
		})
	}

}
