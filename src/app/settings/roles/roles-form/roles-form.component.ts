import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { RolesComponent } from '../roles.component';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {


  RolesFormEdit: FormGroup  
  @ViewChild('resetRolesForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<RolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.RolesFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      intitule: new FormControl(),
      listerChantier:[]
    });    
  } 

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.RolesFormEdit.controls[controlName].hasError(errorName);
  } 
}
