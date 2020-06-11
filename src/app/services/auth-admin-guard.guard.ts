import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class AuthAdminGuardGuard implements CanActivate {

  constructor(private firebaseAuth: AngularFireAuth, private afs : AngularFirestore,private authSercie: AuthService, 
			private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>{	
	return this.authSercie.isSuperAdmin().then((result)=>{
		if(result){
			return true 
		} else {
			this.router.navigate(['/sidenav','home']);
			return false;	
		}
	}) 		 	  	
  }
}