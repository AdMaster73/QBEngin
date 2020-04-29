import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
	providedIn: 'root'
  })
export class UserService {

	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth){
	}	

	/* Cérer un Fournisseur */
	AddUser(user: User){		
		return this.afs.collection('user').doc(user.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),     
			display_name: user.display_name.toString(),
			email:user.email,
			login:user.login
		})
	}
	
	/* Supprimer un Fournisseur */
	async DeleteUser(id) {
		this.afs.doc('user/'+id).delete()
	}	
	/**
	 * Récupérer l'ensamble du liste des utilisateur
	 */
	GetUserList(){
		var admin = require('firebase-admin');
		var app = admin.initializeApp();
		admin.auth().getUser(this.firebaseAuth.auth.currentUser.uid)
		.then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log('Successfully fetched user data:', userRecord.toJSON());
		})
		.catch(function(error) {
			console.log('Error fetching user data:', error);
		});
		/*this.firebaseAuth.auth
		return this.afs.collection<User>('user',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as User;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);*/		
	}
	//Avoir le ID du dernier enregesitrement
	GetUserLastRecord(){		
		return this.afs.collection('user', ref => ref
		  .limit(1)
		  .orderBy('createdAt','desc')
		)				
	  }
	  
	  /* Modifier un User */
	  UpdateUser(user) {  		
		  this.afs.doc('user/'+user.id).update({			  
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),			
			display_name: user.display_name.toUpperCase(),			
			email:user.email,
			login:user.login
		  })														
	  }

}