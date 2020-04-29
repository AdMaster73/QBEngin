import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { FournisseurListComponent } from '../fournisseur-list.component';

@Component({
  selector: 'app-fournisseur-form',
  templateUrl: './fournisseur-form.component.html',
  styleUrls: ['./fournisseur-form.component.scss']
})
export class FournisseurFormComponent implements OnInit {

  FournisseurFormEdit: FormGroup  
  @ViewChild('resetFournisseurForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<FournisseurListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.FournisseurFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      compte:[]
    });    
  } 

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.FournisseurFormEdit.controls[controlName].hasError(errorName);
  }   

}
