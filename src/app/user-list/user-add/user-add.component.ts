import { Component, OnInit,ViewChild, Inject  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { UserListComponent } from '../user-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { firestore } from 'firebase';
import { User } from 'firebase';
import { RolesService } from 'src/app/services/roles.service';
import { UserFormService } from 'src/app/services/userFormService';
import { tap } from 'rxjs/operators';
import { AuthService,CreateUserRequest } from 'src/app/services/auth.service';
import { Roles } from 'src/app/models/engin.model';

interface Role {
  value: string;
  viewValue: string;
}
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
  hide = true;
  UserLastRecord: number;
  Users: User[];
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');
  roles: Roles[]

  @ViewChild('resetUserForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  UserForm = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl(''),
    displayName: new FormControl(''),
    password: new FormControl(''),
    phoneNumber: new FormControl(''),
    role: new FormControl(''),
  });
  title$: Observable<string>;
  user$: Observable<{}>;
  constructor(
    public afs : AngularFireAuth,
      public db : AngularFirestore,
      public fb: FormBuilder,
      private userForm: UserFormService,
      public authService : AuthService,
      private rolesService: RolesService,
      @Inject(MAT_DIALOG_DATA) public data: User,
      public dialogRef: MatDialogRef<UserListComponent>) {}

  ngOnInit() {
    this.rolesService.GetRolesList().subscribe(role=>{
      this.roles = role
    })
    this.title$ = this.userForm.title$;
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
    const { displayName, email, role, password, phoneNumber }:CreateUserRequest = this.UserForm.value;

    this.authService.create({ displayName, email, role, password, phoneNumber }).subscribe(
      res => {
        this.dialogRef.close();
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
