import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { EnginService } from './../../services/engin.service';
import { FournisseurService} from './../../services/fournisseur.service'
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { EnginListComponent } from '../engin-list.component';
import   localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-engin-form',
  templateUrl: './engin-form.component.html',
  styleUrls: ['./engin-form.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
  ]
})
export class EnginFormComponent implements OnInit {

  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject(''); 
  date: any  
  EnginFormEdit: FormGroup  
  @ViewChild('resetEnginForm',{static: true}) myNgForm : NgForm;
       
  constructor(      
      public fb: FormBuilder ,
      private enginService : EnginService,
      public serviceFournisseur : FournisseurService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<EnginListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {      
      this._adapter.setLocale('fr'); 
      registerLocaleData(localeFr, 'fr');     
      var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      this.date = typeof this.data.date_achat === 'string' ? this.date = new Date(this.data.date_achat.replace(pattern,'$3/$2/$1')) : this.date = new Date((this.data.date_achat).toDate());      
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
      n_serie:new FormControl()    
    });      
    this.results$ = this.enginService.searchCategory(this.startAt,"categorie"); 
    this.results_f$ = this.enginService.searchCategory(this.startAt,"fournisseur");
  }
  
  /* Reactive book form */
  onSubmit(engin) {
    this.enginService.UpdateEngin(this.data.id,engin)
    this.dialogRef.close();   
  }
  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.EnginFormEdit.controls[controlName].hasError(errorName);
  }  

  search(searchText){
    this.startAt.next(searchText);
  }  
  /*Avoir le id pour le stocker dans une zone de texte afin de l'ituliser à l'ajout*/
  getCategories(categorie){
    this.enginService.GetIdCategorie(categorie).subscribe((value) => { 
      this.EnginFormEdit.controls['id_categorie'].setValue(value[0].id) 
     })      
  } 
  
  getFournisseur(fournisseur){
    this.enginService.GetIDFourisseur(fournisseur).subscribe((value) => { 
      this.EnginFormEdit.controls['id_fournisseur'].setValue(value[0].id) 
     })
  }

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
    return false
  }
}
