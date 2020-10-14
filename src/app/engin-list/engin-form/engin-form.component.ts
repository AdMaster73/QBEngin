import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { FournisseurService} from './../../services/fournisseur.service'
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { EnginListComponent } from '../engin-list.component';
import   localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { CategorieService } from 'src/app/services/categorie.service';
import { RegionService } from 'src/app/services/region.service';
import { ChauffeurService } from 'src/app/services/chauffeur.service';

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
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  results_ch$: Observable<any[]>;

  accessoire_v:boolean
  typeVs:string[]=['HEURE','KILOMETRE'];
  etatVfs:string[]=['MARCHE','ARRET','MAD','PANNE','EN ATTENTE'];
  etatVks:string[]=['MARCHE','PANNE','INNEXISTANT'];
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');
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
        Validators.required,
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
    this.results$ = this.serviceCategorie.GetCategorieList();
    this.results_f$ = this.serviceFournisseur.GetFournisseurList();
    this.results_ch$ = this.serviceChauffeur.GetChauffeurList();

  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.EnginFormEdit.controls[controlName].hasError(errorName);
  }

  search(searchText){
    this.startAt.next(searchText);
  }

/** */
  getControls(event$,model:string){
    this.EnginFormEdit.controls[model].setValue(event$.option.value.name)
    this.EnginFormEdit.controls['id_'+model].setValue(event$.option.value.id)
  }

}
