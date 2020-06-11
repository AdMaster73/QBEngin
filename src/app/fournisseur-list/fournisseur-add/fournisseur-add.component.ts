import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { FournisseurListComponent } from '../fournisseur-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Fournisseur } from 'src/app/models/engin.model';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-fournisseur-add',
  templateUrl: './fournisseur-add.component.html',
  styleUrls: ['./fournisseur-add.component.scss']
})
export class FournisseurAddComponent implements OnInit {


  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  FournisseurLastRecord: number;
  Fournisseurs: Fournisseur[];
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   


  @ViewChild('resetFournisseurForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  FournisseurForm: FormGroup;  
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private FournisseurService : FournisseurService,      
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<FournisseurListComponent>) {}

  ngOnInit() {  
    this._adapter.setLocale('fr');  
    this.FournisseurService.GetFournisseurLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.FournisseurLastRecord = eval(user.payload.doc.id)+1
      })              
    })    
    this.FournisseurForm = this.fb.group({
      name: ['', Validators.required]
    })   
  }
  search(searchText){
    this.startAt.next(searchText);
  }  

  /* Reactive book form */
  submitFournisseurForm() {
    this.submitted = true;
    if (this.FournisseurForm.invalid) {
      return;
    }
    var iFournisseur : Fournisseur = {
      id:this.FournisseurLastRecord,
      name:this.FournisseurForm.controls['name'].value,
      compte:''
    }    
  
    this.FournisseurService.AddFournisseur(iFournisseur).then(
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
    return this.FournisseurForm.controls[controlName].hasError(errorName);
  }  

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }
}
