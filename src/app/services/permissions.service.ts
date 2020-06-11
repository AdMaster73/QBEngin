import { Injectable } from '@angular/core';
import { Permissions } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) { }
	/* Cérer un Permissions */
	AddPermissions(permissions){		
		return this.afs.collection('permissions').doc(permissions.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
      collection:permissions.collection,  
      /* add: permissions.collection.name,
      list: permissions.list,
      update:permissions.update,
      delete:permissions.delete */
		})
	}
	
	/* Supprimer un Permissions */
	async DeletePermissions(id) {
		this.afs.doc('permissions/'+id).delete()
	}

	/* Retourne une liste des permissionss */
	GetPermissionsList() {		
		return this.afs.collection<Permissions>('permissions',ref=> ref.orderBy('createdAt','asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Permissions;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);	
	}
	
	//Avoir le ID du dernier enregesitrement
	GetPermissionsLastRecord(){		
	  return this.afs.collection('permissions', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )				
	}
	
	/* Modifier un Permissions */
	UpdatePermissions(permissions :Permissions) {  		
		this.afs.doc('permissions/'+permissions.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
      updatedAt: firestore.FieldValue.serverTimestamp(),	
      collection:permissions.collection,
      /* add: permissions.add,
      list: permissions.list,
      update:permissions.update,
      delete:permissions.delete */
		})														
	} 
}
