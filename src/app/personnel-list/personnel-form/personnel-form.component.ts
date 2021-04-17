import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { PersonnelListComponent } from '../personnel-list.component';
import { Fonction, FonctionClass, IFonctionResponse,TypeOfContrat,ITypeOfContratResponse,TypeOfContratClass } from 'src/app/models/engin.model';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FonctionService } from 'src/app/services/fonction.service';
import { TypeOfContratService } from 'src/app/services/type-of-contrat.service';

@Component({
  selector: 'app-personnel-form',
  templateUrl: './personnel-form.component.html',
  styleUrls: ['./personnel-form.component.scss']
})
export class PersonnelFormComponent implements OnInit {

  date: any
  PersonnelFormEdit: FormGroup
  filteredFonctions: Fonction[] = [];
  filteredContrats: TypeOfContrat[] = [];
  isLoading = false;
  @ViewChild('resetPersonnelForm',{static: true}) myNgForm : NgForm;
  constructor(
    public fb: FormBuilder ,
    public serviceFonction : FonctionService,
    public typeOfContratService : TypeOfContratService,
    public dialogRef: MatDialogRef<PersonnelListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      if(data.date_naissance !== undefined){
        data.date_naissance = typeof this.data.date_naissance === 'string' ? this.date = new Date(this.data.date_naissance.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_naissance).toDate());
      }
      if(data.date_ambauche !== undefined){
        data.date_ambauche = typeof this.data.date_ambauche === 'string' ? this.date = new Date(this.data.date_ambauche.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_ambauche).toDate());
      }
    }

  ngOnInit() {
    this.PersonnelFormEdit= this.fb.group({
      id : new FormControl(),
      l_name: ['', Validators.required],
      f_name:['', Validators.required],
      cin:new FormControl(),
      date_naissance:new FormControl(),
      matricule:[''],
      date_ambauche:['',Validators.required],
      duree_contrat:[''],
      heure_pp:[''],
      type_contrat:['',Validators.required],
      type_pointage:['',Validators.required],
      fonction:['',Validators.required]
    });

    this.PersonnelFormEdit.get('fonction')
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

    this.PersonnelFormEdit.get('type_contrat')
    .valueChanges
    .pipe(
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchT({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((fonctions)=>this.filteredContrats = fonctions.results );
  }

  search(filter: {name: string} = {name: ''}): Observable<IFonctionResponse>{
    let filterString:string = filter.name == undefined ? '' : filter.name
    if (typeof( filter.name) === 'object') {
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
  searchT(filter: {name: string} = {name: ''}): Observable<ITypeOfContratResponse>{
    let filterString:string = filter.name == undefined ? '' : filter.name
    if (typeof( filter.name) === 'object') {
      filterString = filter.name['name']
    }
    return this.typeOfContratService.GetTypeOfContratListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((typeOfContrat)=>new TypeOfContratClass(
          typeOfContrat.id,
          typeOfContrat.name
          ))
        .filter(typeOfContrat => typeOfContrat.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }

  displayFn(fonction: Fonction): string {
    return fonction && fonction.name ? fonction.name : '';
  }

  displayFnT(typeOfContrat: TypeOfContrat): string {
    return typeOfContrat && typeOfContrat.name ? typeOfContrat.name : '';
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.PersonnelFormEdit.controls[controlName].hasError(errorName);
  }

}
