import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { ChauffeurFonctionComponent } from '../chauffeur-fonction.component';

@Component({
  selector: 'app-fonction-form',
  templateUrl: './fonction-form.component.html',
  styleUrls: ['./fonction-form.component.scss']
})
export class FonctionFormComponent implements OnInit {

  FonctionFormEdit: FormGroup
  @ViewChild('resetFonctionForm',{static: true}) myNgForm : NgForm;
  constructor(
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<ChauffeurFonctionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.FonctionFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required]
    });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.FonctionFormEdit.controls[controlName].hasError(errorName);
  }

}
