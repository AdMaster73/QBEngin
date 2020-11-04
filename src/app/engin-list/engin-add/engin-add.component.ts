import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm,FormControl } from "@angular/forms";
import { EnginService } from './../../services/engin.service';
import { CategorieService } from './../../services/categorie.service'
import { Engin, Categorie,Fournisseur, Chauffeur, IFournisseurResponse, FournisseurClass, ICategorieResponse, CategorieClass, IChauffeurResponse, ChauffeurClass } from './../../models/engin.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { EnginListComponent } from '../engin-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { ChauffeurService } from 'src/app/services/chauffeur.service';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-engin-add',
  templateUrl: './engin-add.component.html',
  styleUrls: ['./engin-add.component.scss']
})
export class EnginAddComponent implements OnInit {

  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  EnginLastRecord: number;
  engins: Engin[];
  maxDate:Date =  new Date();
  isLoading = false;
  filteredFournisseurs: Fournisseur[] = [];
  filteredCategories: Categorie[] = [];
  filteredChauffeurs: Chauffeur[] = [];


  @ViewChild('resetEnginForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  EnginForm: FormGroup;
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private enginService : EnginService,
      public serviceFournisseur : FournisseurService,
      public serviceCategorie : CategorieService,
      public serviceChauffeur : ChauffeurService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<EnginListComponent>) {
  }

  ngOnInit() {
    this._adapter.setLocale('fr');
    this.enginService.GetEnginLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.EnginLastRecord = eval(user.payload.doc.id)+1
      })
    })
    this.EnginForm = this.fb.group({
      code: ['', Validators.required],
      designation: ['', Validators.required],
      categorie: ['', Validators.required],
      id_categorie:new FormControl(),
      fournisseur: ['', Validators.required],
      id_fournisseur:new FormControl(),
      chauffeur: new FormControl(),
      id_chauffeur:new FormControl(),
      date_achat: new FormControl(),
      value_chat:new FormControl(),
      marque_moteur:new FormControl(),
      serie_moteur:new FormControl(),
      numero_serie:new FormControl()
    })
    this.EnginForm.get('fournisseur')
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
    this.EnginForm.get('categorie')
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
    this.EnginForm.get('chauffeur')
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
    if (typeof( filter.name) === 'object') {
      this.EnginForm.controls['id_fournisseur'].setValue(filter.name['id'])
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
        .filter(fournisseur => fournisseur.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }
  searchCategorie(filter: {name: string} = {name: ''}): Observable<ICategorieResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      this.EnginForm.controls['id_categorie'].setValue(filter.name['id'])
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
        .filter(categorie => categorie.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }
  searchChauffeur(filter: {name: string} = {name: ''}): Observable<IChauffeurResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      this.EnginForm.controls['id_chauffeur'].setValue(filter.name['id'])
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
        .filter(categorie => categorie.name.toUpperCase().includes(filterString.toUpperCase()))
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

  /* Reactive book form */
  submitEnginForm() {
    this.submitted = true;
    if (this.EnginForm.invalid) {
      return;
    }
    var icategorie : Categorie = {
      id:this.EnginForm.controls['id_categorie'].value,
      name:this.EnginForm.controls['categorie'].value,
      compte:''
    };
    var ifournisseur : Fournisseur = {
      id:this.EnginForm.controls['id_fournisseur'].value,
      name:this.EnginForm.controls['fournisseur'].value,
      compte:''
    };
    var ichauffeur : Chauffeur = {
      id:this.EnginForm.controls['id_chauffeur'].value,
      name:this.EnginForm.controls['chauffeur'].value
    };
    let engin: Engin = {
          id: this.EnginLastRecord,
          code: this.EnginForm.controls['code'].value,
          name: this.EnginForm.controls['designation'].value,
          date_achat:this.EnginForm.controls['date_achat'].value,
          valeur_achat: this.EnginForm.controls['value_chat'].value,
          n_serie: this.EnginForm.controls['numero_serie'].value,
          marque_moteur: this.EnginForm.controls['marque_moteur'].value,
          serie_moteur: this.EnginForm.controls['serie_moteur'].value,
          categorie:icategorie,
          fournisseur:ifournisseur,
          chauffeur:ichauffeur
    } ;
    this.enginService.AddEngin(engin).then(
      res => {
        this.dialogRef.close();
      }
    ).catch(
      err=>{
        alert('Vous avez mal tappez les champs !')
      }
    )
  }
  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.EnginForm.controls[controlName].hasError(errorName);
  }

  /* Reset form */
  closeForm() {
    this.dialogRef.close();
  }
}
