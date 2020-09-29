import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { RegionListComponent } from '../region-list.component';

@Component({
  selector: 'app-region-form',
  templateUrl: './region-form.component.html',
  styleUrls: ['./region-form.component.scss']
})
export class RegionFormComponent implements OnInit {

  RegionFormEdit: FormGroup
  @ViewChild('resetCategorieForm',{static: true}) myNgForm : NgForm;
  constructor(
    public fb: FormBuilder ,
    public dialogRef: MatDialogRef<RegionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.RegionFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      compte:[]
    });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.RegionFormEdit.controls[controlName].hasError(errorName);
  }

}
