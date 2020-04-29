import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { CategorieListComponent } from '../categorie-list.component';

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.scss']
})
export class CategorieFormComponent implements OnInit {
  
  CategorieFormEdit: FormGroup  
  @ViewChild('resetCategorieForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<CategorieListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.CategorieFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      compte:[]
    });    
  } 

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.CategorieFormEdit.controls[controlName].hasError(errorName);
  }   
}
