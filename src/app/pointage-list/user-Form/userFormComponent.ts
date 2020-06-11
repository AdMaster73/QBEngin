import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFormService } from 'src/app/services/userFormService';
import { tap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase';

@Component({
    selector: 'app-user-form',
    templateUrl: './userFormComponent.html'
  })
  export class UserFormComponentP implements OnInit {
  
    form = new FormGroup({
      uid: new FormControl(''),
      email: new FormControl(''),
      displayName: new FormControl(''),
      password: new FormControl(''),
      role: new FormControl(''),
    });
    title$: Observable<string>;
    user$: Observable<{}>;
  
    constructor(
      public modal: MatDialog,
      private userService: AuthService,
      private userForm: UserFormService,
      @Inject(MAT_DIALOG_DATA) public data: User
    ) { }
  
    ngOnInit() {
      this.title$ = this.userForm.title$;
      this.user$ = this.userForm.user$.pipe(
        tap(user => {
          if (user) {
            this.form.patchValue(user);
          } else {
            this.form.reset({});
          }
        })
      );
    }
  
    dismiss() {
      this.modal.closeAll();
    }
  
    save() {
      const { displayName, email, role, password, uid } = this.form.value;
      this.modal.closeAll();
    }
  
  }