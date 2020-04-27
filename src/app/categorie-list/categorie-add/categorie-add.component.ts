import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { CategorieListComponent } from '../categorie-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Categorie } from 'src/app/models/engin.model';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-categorie-add',
  templateUrl: './categorie-add.component.html',
  styleUrls: ['./categorie-add.component.scss']
})
export class CategorieAddComponent implements OnInit {

  submitted = false;      
  EnginLastRecord: number;  
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   

  @ViewChild('resetCategorieForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  CategorieForm: FormGroup;  
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private categorieService : CategorieService,      
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<CategorieListComponent>) {}

  ngOnInit() {  
    this._adapter.setLocale('fr');  
    this.categorieService.GetCategorieLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.EnginLastRecord = eval(user.payload.doc.id)+1
      })              
    })    
    this.CategorieForm = this.fb.group({
      name: ['', Validators.required]
    })   
  }
  search(searchText){
    this.startAt.next(searchText);
  }  

  /* Reactive book form */
  submitCategorieForm() {
    this.submitted = true;
    if (this.CategorieForm.invalid) {
      return;
    }
    var icategorie : Categorie = {
      id:this.EnginLastRecord,
      name:this.CategorieForm.controls['name'].value,
      compte:''
    }    
  
    this.categorieService.AddCategorie(icategorie).then(
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
    return this.CategorieForm.controls[controlName].hasError(errorName);
  }  

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }
}
