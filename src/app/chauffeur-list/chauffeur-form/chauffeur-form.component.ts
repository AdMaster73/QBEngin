import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { ChauffeurListComponent } from '../chauffeur-list.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import   localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { Fonction, FonctionClass, IFonctionResponse } from 'src/app/models/engin.model';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FonctionService } from 'src/app/services/fonction.service';

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
  filteredFonctions: Fonction[] = [];
  isLoading = false;
  @ViewChild('resetChauffeurForm',{static: true}) myNgForm : NgForm;
  constructor(
    public fb: FormBuilder ,
    private _adapter: DateAdapter<any>,
    public serviceFonction : FonctionService,
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
      fonction: ['', Validators.required],
      id_fonction: [''],
      matricule: [''],
      date_obtention: [''],
      date_visite_yeux: [''],
      type_permis: ['']
    });
    this.ChauffeurFormEdit.get('fonction')
    .valueChanges
    .pipe(
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(value => this.search({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((fonctions)=>this.filteredFonctions = fonctions.results );
  }

  search(filter: {name: string} = {name: ''}): Observable<IFonctionResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      this.ChauffeurFormEdit.controls['id_fonction'].setValue(filter.name['id'])
      filterString = filter.name['name']
    }
    return this.serviceFonction.GetFonctionListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((fonction)=>new FonctionClass(
          fonction.id,
          fonction.name
          ))
        .filter(fonction => fonction.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }

  displayFn(fonction: Fonction): string {
    return fonction && fonction.name ? fonction.name : '';
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.ChauffeurFormEdit.controls[controlName].hasError(errorName);
  }

}
