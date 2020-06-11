import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { ChantierListComponent } from '../chantier-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Chantier } from 'src/app/models/engin.model';
import { ChantierService } from 'src/app/services/chantier.service';

@Component({
  selector: 'app-chantier-add',
  templateUrl: './chantier-add.component.html',
  styleUrls: ['./chantier-add.component.scss']
})
export class ChantierAddComponent implements OnInit {

  submitted = false;      
  ChantierLastRecord: number;  
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   

  @ViewChild('resetChantierForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  ChantierForm: FormGroup;  
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private chantierService : ChantierService,      
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<ChantierListComponent>) {        
       }        

  ngOnInit() {  
    this._adapter.setLocale('fr');  
    this.chantierService.GetChantierLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.ChantierLastRecord = eval(user.payload.doc.id)+1
      })              
    })    
    this.ChantierForm = this.fb.group({
      name: ['', Validators.required]
    })   
  }
  search(searchText){
    this.startAt.next(searchText);
  }  

  /* Reactive book form */
  submitChantierForm() {
    this.submitted = true;
    if (this.ChantierForm.invalid) {
      return;
    }
    var ichantier : Chantier = {
      id:this.ChantierLastRecord,
      name:this.ChantierForm.controls['name'].value,
      compte:'',
      archive:0
    }    
  
    this.chantierService.AddChantier(ichantier).then(
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
    return this.ChantierForm.controls[controlName].hasError(errorName);
  }  

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }

}
