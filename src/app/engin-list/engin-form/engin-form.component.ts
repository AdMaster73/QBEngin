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
    ) {
      this._adapter.setLocale('fr');  
      this.EnginFormEdit = fb.group({
        code: new FormControl(),
        name: new FormControl(),                
        fournisseur: new FormControl(),   
        id_fournisseur: new FormControl(),   
        categorie:new FormControl(),
        id_categorie: new FormControl(),
        valeur_achat: new FormControl(),
        date_achat: new FormControl(new Date()),       
        marque_moteur:new FormControl(),
        serie_moteur:new FormControl(),
        numero_serie:new FormControl()
      })   
    }

  ngOnInit() {        
    this.results$ = this.enginService.searchCategory(this.startAt,"categorie"); 
    this.results_f$ = this.enginService.searchCategory(this.startAt,"fourisseur");
  }
  editEngin(engin){
    /*var icategorie : Categorie = {
      id:this.EnginForm.controls['categoriehd'].value,
      name:this.EnginForm.controls['categorie'].value
    };
    var ifournisseur : Fournisseur = {
      id:this.EnginForm.controls['fournisseurhd'].value,
      name:this.EnginForm.controls['fournisseur'].value
    };    
    let enginReq: Engin = { 
          id: this.EnginLastRecord,
          code: this.EnginForm.controls['code'].value,
          name: this.EnginForm.controls['designation'].value,
          date_achat:this.EnginForm.controls['date_achat'].value,
          valeur_achat: this.EnginForm.controls['value_chat'].value,
          n_serie: this.EnginForm.controls['numero_serie'].value,
          marque_moteur: this.EnginForm.controls['marque_moteur'].value,
          serie_moteur: this.EnginForm.controls['serie_moteur'].value,
          categorie:icategorie,
          fournisseur:ifournisseur
    } ;    */
    this.enginService.UpdateEngin(this.data.id,engin)
  }
  /* Reactive book form */
  onSubmit(engin) {
          
    /*var icategorie : Categorie = {
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
    } ;*/    
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
  }
}
