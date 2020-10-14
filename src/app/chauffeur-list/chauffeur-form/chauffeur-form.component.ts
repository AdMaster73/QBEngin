import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { ChauffeurListComponent } from '../chauffeur-list.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import   localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-chauffeur-form',
  templateUrl: './chauffeur-form.component.html',
  styleUrls: ['./chauffeur-form.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
  ]
})
export class ChauffeurFormComponent implements OnInit {

  date: any
  ChauffeurFormEdit: FormGroup
  @ViewChild('resetChauffeurForm',{static: true}) myNgForm : NgForm;
  constructor(
    public fb: FormBuilder ,
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<ChauffeurListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this._adapter.setLocale('fr');
      registerLocaleData(localeFr, 'fr');
      var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      if(data.date_obtention != undefined){
        data.date_obtention = typeof this.data.date_obtention === 'string' ? this.date = new Date(this.data.date_obtention.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_obtention).toDate());
      }
      if(data.date_visite_yeux != undefined){
        data.date_visite_yeux = typeof this.data.date_visite_yeux === 'string' ? this.date = new Date(this.data.date_visite_yeux.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_visite_yeux).toDate());
      }
    }

  ngOnInit() {
    this.ChauffeurFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      date_obtention: new FormControl(),
      date_visite_yeux: new FormControl(),
      type_permis: ['']
    });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.ChauffeurFormEdit.controls[controlName].hasError(errorName);
  }

}
