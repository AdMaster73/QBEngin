import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { ChauffeurListComponent } from '../chauffeur-list.component';

@Component({
  selector: 'app-chauffeur-form',
  templateUrl: './chauffeur-form.component.html',
  styleUrls: ['./chauffeur-form.component.scss']
})
export class ChauffeurFormComponent implements OnInit {

  ChauffeurFormEdit: FormGroup
  @ViewChild('resetChauffeurForm',{static: true}) myNgForm : NgForm;
  constructor(
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<ChauffeurListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.ChauffeurFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required]
    });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.ChauffeurFormEdit.controls[controlName].hasError(errorName);
  }

}
