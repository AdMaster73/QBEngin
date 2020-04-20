import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { EnginService } from './../../services/engin.service';
import { Engin, Categorie,Fournisseur } from './../../models/engin.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateAdapter} from '@angular/material/core';
import { EnginListComponent } from '../engin-list.component';
@Component({
  selector: 'app-engin-form',
  templateUrl: './engin-form.component.html',
  styleUrls: ['./engin-form.component.scss']
})
export class EnginFormComponent implements OnInit {
  id: number;
  code: string;
  name:string;
  date_achat:Date;
  valeur_achat: string;
  n_serie: string;
  marque_moteur: string;
  serie_moteur: string;
  id_categorie : number;
  categorie_name : string;
  id_fournisseur : number;
  fournisseur_name : string;
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   
  @ViewChild('resetEnginForm',{static: true}) myNgForm : NgForm;
  EnginFormEdit: FormGroup;
  date = new FormControl(new Date(this.data.date_achat));
  constructor(      
      public fb: FormBuilder ,
      private enginService : EnginService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<EnginListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit() {
    this._adapter.setLocale('fr');  
    this.EnginFormEdit = this.fb.group({
      id: [],
      code: [],
      designation: [],
      categorie: [],
      fournisseur: [],
      categoriehd:[],
      fournisseurhd:[],
      valeur_achat: [],
      date_achat: [],
      value_chat:[],
      marque_moteur:[],
      serie_moteur:[],
      numero_serie:[]
    })  
    this.results$ = this.enginService.searchCategory(this.startAt,"categorie"); 
    this.results_f$ = this.enginService.searchCategory(this.startAt,"fourisseur");
  }
  /* Reactive book form */
  submitEnginForm() {
    if (this.EnginFormEdit.invalid) {
      return;
    }
    var icategorie : Categorie = {
      id:this.EnginFormEdit.controls['categoriehd'].value,
      name:this.EnginFormEdit.controls['categorie'].value
    };
    var ifournisseur : Fournisseur = {
      id:this.EnginFormEdit.controls['fournisseurhd'].value,
      name:this.EnginFormEdit.controls['fournisseur'].value
    };    
    let engin: Engin = { 
          id: this.EnginFormEdit.controls['id'].value,
          code: this.EnginFormEdit.controls['code'].value,
          name: this.EnginFormEdit.controls['designation'].value,
          date_achat:this.EnginFormEdit.controls['date_achat'].value,
          valeur_achat: this.EnginFormEdit.controls['valeur_achat'].value,
          n_serie: this.EnginFormEdit.controls['numero_serie'].value,
          marque_moteur: this.EnginFormEdit.controls['marque_moteur'].value,
          serie_moteur: this.EnginFormEdit.controls['serie_moteur'].value,
          categorie:icategorie,
          fournisseur:ifournisseur
    } ;
    this.enginService.UpdateEngin(engin.id,engin)      
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
      this.EnginFormEdit.controls['categoriehd'].setValue(value[0].id) 
     })      
  } 
  
  getFournisseur(fournisseur){
    this.enginService.GetIDFourisseur(fournisseur).subscribe((value) => { 
      this.EnginFormEdit.controls['fournisseurhd'].setValue(value[0].id) 
     })
  }

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }
}
