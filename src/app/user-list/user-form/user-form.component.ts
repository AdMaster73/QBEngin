import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { UserListComponent } from '../user-list.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

  UserFormEdit: FormGroup    
  @ViewChild('resetUserForm',{static: true}) myNgForm : NgForm;  
  
  constructor(      
    public fb: FormBuilder ,
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

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.UserFormEdit.controls[controlName].hasError(errorName);
  }   
}
