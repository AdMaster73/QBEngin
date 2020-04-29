import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { UserListComponent } from '../user-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { User } from 'src/app/models/engin.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  UserLastRecord: number;
  Users: User[];
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   


  @ViewChild('resetUserForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  UserForm: FormGroup;  
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private UserService : UserService,      
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<UserListComponent>) {}

  ngOnInit() {  
    this._adapter.setLocale('fr');  
    this.UserService.GetUserLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.UserLastRecord = eval(user.payload.doc.id)+1
      })              
    })    
    this.UserForm = this.fb.group({
      display_name: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      login: ['', Validators.required]      
    })   
  }
  search(searchText){
    this.startAt.next(searchText);
  }  

  /* Reactive book form */
  submitUserForm() {
    this.submitted = true;
    if (this.UserForm.invalid) {
      return;
    }
    var iUser : User = {
      id:this.UserLastRecord,
      display_name:this.UserForm.controls['display_name'].value,
      email:this.UserForm.controls['email'].value,
      login : this.UserForm.controls['login'].value
    }    
  
    this.UserService.AddUser(iUser).then(
      res => {
        this.dialogRef.close();
      }
    ).catch(
      err=>{
        alert('Vous avez mal tappez les champs !')
      }
    )      
  }
  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.UserForm.controls[controlName].hasError(errorName);
  }  

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }

}
