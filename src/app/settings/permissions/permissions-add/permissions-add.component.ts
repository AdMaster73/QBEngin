import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators,FormControl , NgForm } from "@angular/forms";
import { PermissionsService } from './../../../services/permissions.service';
import { Permissions, Collections } from './../../../models/engin.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';
import {DateAdapter} from '@angular/material/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionsService } from 'src/app/services/collections.service';
import { PermissionsComponent } from '../permissions.component';

@Component({
  selector: 'app-permissions-add',
  templateUrl: './permissions-add.component.html',
  styleUrls: ['./permissions-add.component.scss']
})
export class PermissionsAddComponent implements OnInit {

  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  PermissionsLastRecord: number;
  results$ : Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   


  @ViewChild('resetPermissionsForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;  
  PermissionsForm: FormGroup;   
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private permissionsService : PermissionsService,      
      public collectionsService : CollectionsService, 
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<PermissionsComponent>) {     
  }

  ngOnInit() {  
    this._adapter.setLocale('fr');  
    this.permissionsService.GetPermissionsLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.PermissionsLastRecord = eval(user.payload.doc.id)+1
      })              
    })
    this.PermissionsForm = this.fb.group({
      collections: ['', Validators.required],
      id_collections: new FormControl(),
    })
    this.results$ = this.collectionsService.GetCollectionsList();  
  }
  search(searchText){
    this.startAt.next(searchText);
  }  
  /*Avoir le id pour le stocker dans une zone de texte afin de l'ituliser à l'ajout*/
  getControls(event$,model:string){     
    this.PermissionsForm.controls[model].setValue(event$.option.value.name) 
    this.PermissionsForm.controls['id_'+model].setValue(event$.option.value.id)
  } 
  /* Reactive book form */
  submitPermissionsForm() {
    this.submitted = true;
    if (this.PermissionsForm.invalid) {
      return;
    }
    var icollections : Collections = {
      id:this.PermissionsForm.controls['id_collections'].value,
      name:this.PermissionsForm.controls['collections'].value
    };        
    let permissions: Permissions = { 
          id: this.PermissionsLastRecord,          
          collection:icollections
    } ;    
    this.permissionsService.AddPermissions(permissions).then(
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
    return this.PermissionsForm.controls[controlName].hasError(errorName);
  }  

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }

}
