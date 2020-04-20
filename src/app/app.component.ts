import { Component} from '@angular/core';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-root",  
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	  secondes: number;
	  counterSubscription: Subscription;
	  isAuth : number; 
	  
	  constructor() {}	 		
}
