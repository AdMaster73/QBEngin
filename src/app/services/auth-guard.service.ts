import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private firebaseAuth: AngularFireAuth,
			private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {	
	return new Promise(
		(resolve,reject)=>{		
			this.firebaseAuth.authState	.subscribe(
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