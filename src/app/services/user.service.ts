import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
	providedIn: 'root'
  })
export class UserService {

	constructor(private afs: AngularFirestore){}

	/* Cérer un Fournisseur */
	AddUser(user: User){		
		return this.afs.collection('user').doc(user.id.toString()).set({
			createdAt: firestore.FieldValue.serverTimestamp(),       
			firstName: user.display_name.toString(),
			email:user.email,
			login:user.login
		})
	}
	
	/* Supprimer un Fournisseur */
	async DeleteUser(id) {
		this.afs.doc('user/'+id).delete()
	}	
	GetUserList(){
		return this.afs.collection<User>('user',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
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
		return this.afs.collection('user', ref => ref
		  .limit(1)
		  .orderBy('createdAt','desc')
		)				
	  }
	  
	  /* Modifier un User */
	  UpdateUser(id, user) {  		
		  this.afs.doc('user/'+id).update({
			display_name: user.display_name.toString(),			
			email:user.email.toString,
			login:user.login
		  })														
	  }

}