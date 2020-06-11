import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { CollectionsComponent } from '../collections.component';

@Component({
  selector: 'app-collections-form',
  templateUrl: './collections-form.component.html',
  styleUrls: ['./collections-form.component.scss']
})
export class CollectionsFormComponent implements OnInit {
  CollectionsFormEdit: FormGroup  
  @ViewChild('resetCollectionsForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<CollectionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.CollectionsFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      intitule: new FormControl(),
      toolTipe: new FormControl(),
      icon: new FormControl(),      
    });    
  } 

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.CollectionsFormEdit.controls[controlName].hasError(errorName);
  } 
}
