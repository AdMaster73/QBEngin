import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { FournisseurService} from './../../services/fournisseur.service'
import { Observable } from 'rxjs/Observable';
import { DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { EnginListComponent } from '../engin-list.component';
import   localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { CategorieService } from 'src/app/services/categorie.service';
import { ChauffeurService } from 'src/app/services/chauffeur.service';
import { Categorie, CategorieClass, Chauffeur, ChauffeurClass, Fournisseur, FournisseurClass, ICategorieResponse, IChauffeurResponse, IFournisseurResponse } from 'src/app/models/engin.model';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-engin-form',
  templateUrl: './engin-form.component.html',
  styleUrls: ['./engin-form.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
  ]
})
export class EnginFormComponent implements OnInit {

  date: any
  EnginFormEdit: FormGroup
  isLoading = false;
  filteredFournisseurs: Fournisseur[] = [];
  filteredCategories: Categorie[] = [];
  filteredChauffeurs: Chauffeur[] = [];

  accessoire_v:boolean
  typeVs:string[]=['HEURE','KILOMETRE'];
  etatVfs:string[]=['MARCHE','ARRET','MAD','PANNE','EN ATTENTE'];
  etatVks:string[]=['MARCHE','PANNE','INNEXISTANT'];
  @ViewChild('resetEnginForm',{static: true}) myNgForm : NgForm;

  constructor(
      public fb: FormBuilder ,
      public serviceFournisseur : FournisseurService,
      public serviceCategorie : CategorieService,
      public serviceChauffeur : ChauffeurService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<EnginListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this._adapter.setLocale('fr');
      registerLocaleData(localeFr, 'fr');
      var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      if (data.date_v === undefined ) data.date_v= ''
      data.date_achat = typeof this.data.date_achat === 'string' ? this.date = new Date(this.data.date_achat.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_achat).toDate());
      data.date_v = typeof this.data.date_v === 'string' ? this.date = new Date(this.data.date_v.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_v).toDate());
    }

  ngOnInit() {
    this.EnginFormEdit= this.fb.group({
      id : new FormControl(),
      code: ['', Validators.required],
      name: ['', Validators.required],
      fournisseur: ['', Validators.required],
      id_fournisseur:['', Validators.required],
      categorie:['', Validators.required],
      id_categorie: ['', Validators.required],
      chauffeur:['', Validators.required],
      id_chauffeur: ['', Validators.required],
      valeur_achat: new FormControl(),
      date_achat:[''],
      date_v:new FormControl({value:'',disabled:true}),
      compteur_v:[''],
      vidange_alarm:new FormControl({value:0},[Validators.max(500)]),
      compteur_dernier_v:new FormControl({value:'',disabled:true}),
      marque_moteur:new FormControl(),
      serie_moteur:new FormControl(),
      consomation:new FormControl(),
      n_serie:new FormControl(),
      b_code:new FormControl('', [
        /* Validators.required, */
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]),
      type_v:[],
      etat_f:new FormControl(),
      etat_k:new FormControl(),
      accessoire_v:new FormControl(),
      compteur:new FormControl(),
      pointed:new FormControl(),
      porte:new FormControl()
    });
    this.EnginFormEdit.get('fournisseur')
    .valueChanges
    .pipe(
      debounceTime(200),
      tap(() => this.isLoading = true),
      switchMap(value => this.search({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((fournisseurs)=>this.filteredFournisseurs = fournisseurs.results );
    this.EnginFormEdit.get('categorie')
    .valueChanges
    .pipe(
      debounceTime(200),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchCategorie({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((categories)=>this.filteredCategories = categories.results );
    this.EnginFormEdit.get('chauffeur')
    .valueChanges
    .pipe(
      debounceTime(200),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchChauffeur({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((chauffeurs)=>this.filteredChauffeurs = chauffeurs.results );

  }

  search(filter: {name: string} = {name: ''}): Observable<IFournisseurResponse>{
    let filterString:string = filter.name
    console.log(filter)
    if (typeof( filter.name) === 'object') {
      this.EnginFormEdit.controls['id_fournisseur'].setValue(filter.name['id'])
      filterString = filter.name['name']
    }
    return this.serviceFournisseur.GetFournisseurListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((fournisseur)=>new FournisseurClass(
          fournisseur.id,
          fournisseur.name
          ))
        .filter(fournisseur => {
          fournisseur.name.toUpperCase().includes(filterString.toUpperCase())})
        return response;
      })
      );
  }
  searchCategorie(filter: {name: string} = {name: ''}): Observable<ICategorieResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      this.EnginFormEdit.controls['id_categorie'].setValue(filter.name['id'])
      filterString = filter.name['name']
    }
    return this.serviceCategorie.GetCategorieListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((categorie)=>new CategorieClass(
          categorie.id,
          categorie.name
          ))
        .filter(categories => categories.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }
  searchChauffeur(filter: {name: string} = {name: ''}): Observable<IChauffeurResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      this.EnginFormEdit.controls['id_chauffeur'].setValue(filter.name['id'])
      filterString = filter.name['name']
    }
    return this.serviceChauffeur.GetChauffeurListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((chauffeur)=>new ChauffeurClass(
          chauffeur.id,
          chauffeur.name
          ))
        .filter(chauffeures => chauffeures.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }
  displayFnFournisseur(fournisseur: Fournisseur): string {
    return fournisseur && fournisseur.name ? fournisseur.name : '';
  }
  displayFnCategorie(categorie: Categorie): string {
    return categorie && categorie.name ? categorie.name : '';
  }
  displayFnChauffeur(chauffeur: Chauffeur): string {
    return chauffeur && chauffeur.name ? chauffeur.name : '';
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.EnginFormEdit.controls[controlName].hasError(errorName);
  }

}
