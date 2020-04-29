import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { BehaviorSubject } from 'rxjs';
import { ChantierListComponent } from '../chantier-list.component';

@Component({
  selector: 'app-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {

  startAt: BehaviorSubject<string | null> = new BehaviorSubject(''); 

  ChantierFormEdit: FormGroup  
  @ViewChild('resetChantierForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<ChantierListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.ChantierFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      compte:[],
      archive:[]
    });    
  }
 
  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.ChantierFormEdit.controls[controlName].hasError(errorName);
  }   

}
