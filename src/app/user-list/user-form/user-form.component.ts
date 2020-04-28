import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { UserService } from './../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateAdapter} from '@angular/material/core';
import { UserListComponent } from '../user-list.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject(''); 
  date: any  
  UserFormEdit: FormGroup  
  @ViewChild('resetUserForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    private UserService : UserService,
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<UserListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.UserFormEdit= this.fb.group({
      id : new FormControl(),
      display_name: ['', Validators.required],
      login:['', Validators.required],
      email: ['', Validators.required]
    });    
  }

  /* Reactive book form */
  onSubmit(user) {
    this.UserService.UpdateUser(this.data.id,user)
    this.dialogRef.close();   
  }  

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.UserFormEdit.controls[controlName].hasError(errorName);
  }   

  search(searchText){
    this.startAt.next(searchText);
  } 
  
  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
    return false
  }

}
