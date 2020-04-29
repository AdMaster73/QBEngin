import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { EnginService } from './../../services/engin.service';
import { CategorieService } from './../../services/categorie.service'
import { Engin, Categorie,Fournisseur } from './../../models/engin.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';
import {DateAdapter} from '@angular/material/core';
import { EnginListComponent } from '../engin-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { FournisseurService } from 'src/app/services/fournisseur.service';

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
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   


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
      fournisseur: ['', Validators.required],
      id_categorie:['', Validators.required],
      id_fournisseur:['', Validators.required],
      date_achat: [],
      value_chat:[],
      marque_moteur:[],
      serie_moteur:[],
      numero_serie:[]
    })
    this.results$ = this.serviceCategorie.GetCategorieList(); 
    this.results_f$ = this.serviceFournisseur.GetFournisseurList(); 
  }
  search(searchText){
    this.startAt.next(searchText);
  }  
  /*Avoir le id pour le stocker dans une zone de texte afin de l'ituliser à l'ajout*/
  getControls(event$,model:string){     
    this.EnginForm.controls[model].setValue(event$.option.value.name) 
    this.EnginForm.controls['id_'+model].setValue(event$.option.value.id)
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
          fournisseur:ifournisseur
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
