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
  myFournisseur = new FormControl();
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
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
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<EnginListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this._adapter.setLocale('fr');
      registerLocaleData(localeFr, 'fr');
      var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      this.date = typeof this.data.date_achat === 'string' ? this.date = new Date(this.data.date_achat.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_achat).toDate());
      //data.accessoire_v == 1 ? this.accessoire_v = true : this.accessoire_v = false
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
      valeur_achat: new FormControl(),
      date_achat:new FormControl(this.date, Validators.required),
      marque_moteur:new FormControl(),
      serie_moteur:new FormControl(),
      n_serie:new FormControl(),
      b_code:new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]),
      type_v:new FormControl('',Validators.required),
      etat_f:new FormControl('',Validators.required),
      etat_k:new FormControl('',Validators.required),
      accessoire_v:new FormControl()
    });
    this.results$ = this.serviceCategorie.GetCategorieList();
    this.results_f$ = this.serviceFournisseur.GetFournisseurList();
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
