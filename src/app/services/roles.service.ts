import { Injectable } from '@angular/core';
import { Roles } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(public authService: AuthService,private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) { }
	/* Cérer un Roles */
	AddRoles(Roles: Roles){
		return this.afs.collection('roles').doc(Roles.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: Roles.name,
			intitule: Roles.intitule.toUpperCase()
		})
	}

	/* Supprimer un Roles */
	async DeleteRoles(id) {
		this.afs.doc('roles/'+id).delete()
	}

	/* Retourne une liste des roless */
	GetRolesList() {
		return this.afs.collection<Roles>('roles',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Roles;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}
	getRolesByNameAndType(role:string){
		return this.afs.collection<Roles>('roles',ref=>ref.where('name','==',role)
		/* .where('list','array-contains','1') */).snapshotChanges().pipe(
			map(actions =>{
				return actions.map(a=>{
					const data = a.payload.doc.data() as Roles;
					const id = a.payload.doc.id;
					return { id, ...data };
				})
			})
		)
	}

	addRolesCollections(typeRoles:string,rolesId:string,collectionId:string){
		switch (typeRoles) {
			case 'list':
				this.afs.doc('/roles/'+rolesId).update({
					list:firebase.firestore.FieldValue.arrayUnion(collectionId)
				})
				break;
			case 'add':
				this.afs.doc('/roles/'+rolesId).update({
					add:firebase.firestore.FieldValue.arrayUnion(collectionId)
				})
				break;
			case 'update':
				this.afs.doc('/roles/'+rolesId).update({
					update:firebase.firestore.FieldValue.arrayUnion(collectionId)
				})
				break;
			case 'delete':
				this.afs.doc('/roles/'+rolesId).update({
					delete:firebase.firestore.FieldValue.arrayUnion(collectionId)
				})
				break;
			case 'accessoire':
				this.afs.doc('/roles/'+rolesId).update({
					accessoire:firebase.firestore.FieldValue.arrayUnion(collectionId)
				})
				break;
			default:
				break;
		}
	}

	deleteRolesCollections(typeRoles:string,rolesId:string,collectionId:string){
		switch (typeRoles) {
			case 'list':
				this.afs.doc('/roles/'+rolesId).update({
					list:firebase.firestore.FieldValue.arrayRemove(
						collectionId
					)
				})
				break;
			case 'add':
				this.afs.doc('/roles/'+rolesId).update({
					add:firebase.firestore.FieldValue.arrayRemove(collectionId)
				})
				break;
			case 'update':
				this.afs.doc('/roles/'+rolesId).update({
					update:firebase.firestore.FieldValue.arrayRemove(collectionId)
				})
				break;
			case 'delete':
				this.afs.doc('/roles/'+rolesId).update({
					delete:firebase.firestore.FieldValue.arrayRemove(collectionId)
				})
				break;
			case 'accessoire':
				this.afs.doc('/roles/'+rolesId).update({
					accessoire:firebase.firestore.FieldValue.arrayRemove(collectionId)
				})
				break;
			default:
				break;
		}
	}

	//Avoir le ID du dernier enregesitrement
	GetRolesLastRecord(){
	  return this.afs.collection('roles', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier un Roles */
	UpdateRoles(roles) {
		this.afs.doc('roles/'+roles.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: roles.name,
			intitule: roles.intitule.toUpperCase(),
			listerChantier:roles.listerChantier
		})
	}

	getFilterRoleChantier(){
		return this.afs.collection<Roles>('roles',ref=>ref.where('listerChantier','==',true)).snapshotChanges().pipe(
			map(actions =>{
				return actions.map(a=>{
					const data = a.payload.doc.data() as Roles;
					const id = a.payload.doc.id;
					return { id, ...data };
				})
			})
		)
	}

}
