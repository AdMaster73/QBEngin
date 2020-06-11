import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { CollectionsComponent } from '../collections.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Collections } from 'src/app/models/engin.model';
import { CollectionsService } from 'src/app/services/collections.service';

@Component({
  selector: 'app-collections-add',
  templateUrl: './collections-add.component.html',
  styleUrls: ['./collections-add.component.scss']
})
export class CollectionsAddComponent implements OnInit {

  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  CollectionsLastRecord: number;
  Collectionss: Collections[];
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   


  @ViewChild('resetCollectionsForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  CollectionsForm: FormGroup;  
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private CollectionsService : CollectionsService,      
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<CollectionsComponent>) {}

  ngOnInit() {  
    this._adapter.setLocale('fr');  
    this.CollectionsService.GetCollectionsLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{        
        this.CollectionsLastRecord = eval(user.payload.doc.id)+1
      })              
    })    
    this.CollectionsForm = this.fb.group({
      name: ['', Validators.required],
      intitule: new FormControl(),
      toolTipe: new FormControl(),
      icon: new FormControl(),
    })   
  }
  search(searchText){
    this.startAt.next(searchText);
  }  

  /* Reactive book form */
  submitCollectionsForm() {
    this.submitted = true;
    if (this.CollectionsForm.invalid) {
      return;
    }
    let id_collections: number
    this.CollectionsLastRecord === undefined ? id_collections = 1 : id_collections = this.CollectionsLastRecord
    var iCollections : Collections = {
      id:id_collections,
      name:this.CollectionsForm.controls['name'].value,
      intitule: this.CollectionsForm.controls['intitule'].value,
      toolTipe: this.CollectionsForm.controls['toolTipe'].value,
      icon: this.CollectionsForm.controls['icon'].value,   
    }    
  
    this.CollectionsService.AddCollections(iCollections).then(
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
    return this.CollectionsForm.controls[controlName].hasError(errorName);
  }  

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }
}
