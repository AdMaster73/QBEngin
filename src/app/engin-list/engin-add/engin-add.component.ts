import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { EnginService } from './../../services/engin.service';
import { Engin, Categorie,Fournisseur } from './../../models/engin.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';
import {DateAdapter} from '@angular/material/core';
import { EnginListComponent } from '../engin-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';

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
  EnginCategorieHD: Observable<any[]>;
  EnginFournisseurHD: Observable<any[]>;
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
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<EnginListComponent>) { 
      /*var categorie =
      [] 
    var i = 0        
    categorie.forEach(function(obj) {  
      i+=1          
      db.collection("engin").doc(i.toString()).set({
          createdAt: firestore.FieldValue.serverTimestamp(),
          code: obj.code,
          name:obj.name,
          date_achat : obj.date_achat,
          valeur_achat : obj.valeur_achat,
          n_serie : obj.n_serie,
          marque_moteur:obj.marque_moteur,
          serie_moteur : obj.serie_moteur,
          fournisseur : {
            id: obj["fournisseur"].id,
            name: obj["fournisseur"].name
          },
          categorie:{
            id: obj["categorie"].id,
            name: obj["categorie"].name
          }
      }, {merge: true}).then(function(docRef) {
          console.log("Document written with ID: ", docRef);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    });*/
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
      categoriehd:['', Validators.required],
      fournisseurhd:['', Validators.required],
      date_achat: [],
      value_chat:[],
      marque_moteur:[],
      serie_moteur:[],
      numero_serie:[]
    })
    this.results$ = this.enginService.searchCategory(this.startAt,"categorie"); 
    this.results_f$ = this.enginService.searchCategory(this.startAt,"fourisseur");    
  }
  search(searchText){
    this.startAt.next(searchText);
  }  
  /*Avoir le id pour le stocker dans une zone de texte afin de l'ituliser à l'ajout*/
  getCategories(categorie){
    this.enginService.GetIdCategorie(categorie).subscribe((value) => { 
      this.EnginForm.controls['categoriehd'].setValue(value[0].id) 
     })      
  } 
  
  getFournisseur(fournisseur){
    this.enginService.GetIDFourisseur(fournisseur).subscribe((value) => { 
      this.EnginForm.controls['fournisseurhd'].setValue(value[0].id) 
     })
  }
  /* Reactive book form */
  submitEnginForm() {
    this.submitted = true;
    if (this.EnginForm.invalid) {
      return;
    }
    var icategorie : Categorie = {
      id:this.EnginForm.controls['categoriehd'].value,
      name:this.EnginForm.controls['categorie'].value
    };
    var ifournisseur : Fournisseur = {
      id:this.EnginForm.controls['fournisseurhd'].value,
      name:this.EnginForm.controls['fournisseur'].value
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
