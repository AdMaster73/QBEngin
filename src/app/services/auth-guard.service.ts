import { /*ActivatedRouteSnapshot, */CanActivate, Router/*, RouterStateSnapshot*/ } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { logging } from 'protractor';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(/*private authService: AuthService,*/private firebaseAuth: AngularFireAuth,
              private router: Router) {}

  canActivate(
    /*route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot*/): Observable<boolean> | Promise<boolean> | boolean {
    /*if(this.authService.isAuth) {
      return true;
    } else {
      this.router.navigate(['/auth']);
	}*/	
	return new Promise(
		(resolve,reject)=>{		
			this.firebaseAuth.authState	.subscribe
			/*firebase.auth().onAuthStateChanged*/(
				(user)=>{
					if(user){
						resolve(true);
					}else{
						this.router.navigate(['/auth','signin']);
						resolve(false);					
					}
				}
			)			
		}
	)	
  }
}