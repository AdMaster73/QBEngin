import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { User, Roles } from '../models/User.model';
import { map, switchMap } from 'rxjs/operators';
import { isUndefined } from 'util';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService{

  isAuth = false;
  isAdmin:Promise<boolean> ;
  
 constructor(private afs: AngularFirestore,
  private db: AngularFireDatabase
  ,private firebaseAuth: AngularFireAuth){} 
createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          (user) => {   
            this.updateUserData(user)                     
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
}

private updateUserData(user) {
  // Sets user data to firestore on login  
  var data:User 
  const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.firebaseAuth.auth.currentUser.uid}`)
  userRef.snapshotChanges().subscribe(actions =>{
    if(actions.payload.data().roles.subscriber){      
      data = { 
        uid:user.user.uid,
        email: user.user.email, 
        displayName: user.user.displayName, 
        photoURL: user.user.photoURL,
        roles: {subscriber:true}
      }      
    }else{
      data = {  
        uid:user.user.uid,
        email: user.user.email, 
        displayName: user.user.displayName, 
        photoURL: user.user.photoURL,
        roles: {admin:true}
      }      
    }       
    userRef.set(data, { merge: true })         
  })  
}

signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (user) => {   
            this.updateUserData(user)  
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }	
  signOutUser() {
      firebase.auth().signOut();
  }	
	

	signIn(){
		return new Promise(
		  (resolve, reject) => {
			setTimeout(
			  (user) => {
        this.updateUserData(user)
        this.isAuth = true;
				resolve(true);
			  }, 2000
			);
		  }
		);	
	}
	signOut(){
		this.isAuth = false;
	}
}