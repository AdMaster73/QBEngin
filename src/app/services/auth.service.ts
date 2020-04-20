import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthService{
	
createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
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
          () => {
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
	
	
	
	isAuth = false;
	signIn(){
		return new Promise(
		  (resolve, reject) => {
			setTimeout(
			  () => {
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