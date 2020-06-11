import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore,User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of, combineLatest } from 'rxjs';
import * as firebase from 'firebase';
import { chantierUser, Chantier } from '../models/engin.model'
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
  })
export class UserService {

	listUserChantier : User[]=[]
	constructor(private afs: AngularFirestore, private authService : AuthService,
		private firebaseAuth: AngularFireAuth){			
	}	

	addChantierUser(chantierID:string,user:any){		
		this.afs.doc('/chantier/'+chantierID).update({
			users:firebase.firestore.FieldValue.arrayUnion(user.uid)			
		})
	}

	deleteChantierUser(chantierID:string,user:User){
		const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
		this.afs.doc('/chantier/'+chantierID).update({
			users:arrayRemove(
				user.uid				
			)
		})		
	}

	listChantierUser(chantierID):Observable<User[]>{
		return combineLatest(
			this.afs.doc('chantier/'+chantierID).valueChanges(),
			this.authService.users$
		).pipe(
			map(([chantier,users])=>{
				if(chantier['users'] === undefined){
					return []
				}
				return users.filter(user=>chantier['users'].includes(user.uid))
			}))		
	}
	
/** */
	public currentUserValue(): Observable<boolean> | Promise<boolean> | boolean {
		return new Promise((resolve,reject)=>{
		firebase.auth().currentUser.getIdTokenResult()
		.then((idTokenResult)=>{
			if(!!idTokenResult.claims.admin){
			resolve(true)
			} else {
			resolve(false)
			}
		}).catch((error)=>{
			console.log(error)
		})    
		})
	}
	/* Cérer un Fournisseur */
	AddUser(user: User){		
		return this.afs.collection('users').doc(user.uid.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),     
			displayName: user.displayName.toString(),
			email:user.email
		},{ merge: true })
	}
	
	/* Supprimer un Fournisseur */
	async DeleteUser(uid) {
		this.afs.doc('users/'+uid).delete()
	}	
	/**
	 * Récupérer l'ensamble du liste des utilisateur
	 */
	GetUserList(){
		return this.afs.collection<User>('users').snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {				
				const data = a.payload.doc.data() as User;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);	
	}
	//Avoir le ID du dernier enregesitrement
	GetUserLastRecord(){		
		return this.afs.collection('users', ref => ref
		  .limit(1)
		  .orderBy('createdAt','desc')
		)				
	  }
	  
	/* Modifier un User */
	UpdateUser(user) {  	
		console.log(user)	
		return false
		this.afs.doc('users/'+user.id).update({			  
		updatedBy: this.firebaseAuth.auth.currentUser.uid,
		updatedAt: firestore.FieldValue.serverTimestamp(),			
		displayName: user.displayName.toUpperCase(),			
		email:user.email
		})														
	}

}