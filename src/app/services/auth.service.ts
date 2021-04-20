import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
//import { User, Role } from '../models/User.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, from, NEVER } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import {  mergeMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from 'firebase';
import { IUserResponse } from '../models/engin.model';

export type CreateUserRequest = { displayName: string, password: string, email: string, role: string, phoneNumber: string }
export type UpdateUserRequest = { uid: string } & CreateUserRequest

@Injectable({providedIn:'root'})
export class AuthService{

  isAuth = false;
  user : Observable<User>
  private baseUrl = 'https://us-central1-admater-a06e8.cloudfunctions.net/api/users'

 constructor(private afs: AngularFirestore,private db:AngularFireDatabase,
  private firebaseAuth: AngularFireAuth,private http: HttpClient){}
/**
 */
/** */
get users$(): Observable<User[]> {
  return this.http.get<{ users: User[] }>(`${this.baseUrl}`).pipe(
    map(result => {
      return result.users
    })
  )
}

user$(id: string): Observable<User> {
  return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
    map(result => {
      return result.user
    })
  )
}

create(user: CreateUserRequest) {
  return this.http.post(`${this.baseUrl}`, user)
}

edit(user: UpdateUserRequest) {
  return this.http.patch(`${this.baseUrl}/${user.uid}`, user)
}

remove(user: UpdateUserRequest) {
  return false
  return this.http.delete(`${this.baseUrl}/${user.uid}`)
}

 /* */
  public updateUserData(user) {
    var data = user
     const userRef: AngularFirestoreDocument<User> = this.afs
    .doc(`users/${this.firebaseAuth.auth.currentUser.uid}`)
    userRef.snapshotChanges().subscribe(actions =>{
        data = {
          updatedBy: this.firebaseAuth.auth.currentUser.uid,
			    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          email: user.user.email,
          displayName: user.user.displayName,
        }
      userRef.set(data, { merge: true })
    })
  }

createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          (user) => {
            resolve(true);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
}

getUser(): Observable<any> {
  return this.firebaseAuth.authState.pipe(
    mergeMap(authState => {
      if (authState) {
        return from(this.afs.doc(`users/${authState.uid}`).get());
      } else {
        return NEVER;
      }
    })
  );
}

isLoggedURL(){
return new Promise((resolve,reject)=>{
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      resolve (true)
    } else {
      resolve (false)
    }
  })
})
}

isSuperAdmin(){
  return new Promise(
    (resolve, reject) => {
      firebase.auth().currentUser.getIdTokenResult().then(
        (idTokenResult) => {
          if(idTokenResult.claims.role === 'admin'){
            resolve(true)
          } else {
            resolve(false)
          }
        },
        (error) => {
          reject(error);
        }
      );
    }
  );
}



signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (user) => {
            this.isAuth = true
            resolve(true);
          },
          (error) => {
            this.isAuth = false
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
