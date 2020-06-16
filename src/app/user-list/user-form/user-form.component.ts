import { Component, OnInit,Inject, ViewChild, NgModule} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { UserListComponent } from '../user-list.component';
import { RolesService } from '../../services/roles.service';
import { User } from '../../models/User.model'
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material/chips';
import { ChantierService } from '../../services/chantier.service';
import {Observable} from 'rxjs';
import { Roles } from 'src/app/models/engin.model';

interface Role {
  value: string;
  viewValue: string;
}
@NgModule({
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ]
})
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

  visible = true;
  addOnBlur = true;
  hide = true;

  UserFormEdit: FormGroup
  user$: Observable<User>

  selectedCar: string;

  roles: Roles[];

  @ViewChild('resetUserForm',{static: true}) myNgForm : NgForm;

  constructor(
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<UserListComponent>,
    public chantierService : ChantierService,
    private rolesService: RolesService,
    @Inject(MAT_DIALOG_DATA) public data: User) {}

  ngOnInit() {
    this.rolesService.GetRolesList().subscribe(role=>{
      this.roles = role
    })
    this.UserFormEdit= this.fb.group({
      displayName: new FormControl(),
      email:['',[ Validators.required,Validators.email]],
      password: new FormControl(),
      role:new FormControl()
    });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.UserFormEdit.controls[controlName].hasError(errorName);
  }

}
