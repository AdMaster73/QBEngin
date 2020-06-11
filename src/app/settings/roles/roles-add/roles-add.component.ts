import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { RolesComponent } from '../roles.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Roles } from 'src/app/models/engin.model';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-roles-add',
  templateUrl: './roles-add.component.html',
  styleUrls: ['./roles-add.component.scss']
})
export class RolesAddComponent implements OnInit {


  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  RolesLastRecord: number;
  Roless: Roles[];
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');   


  @ViewChild('resetRolesForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  RolesForm: FormGroup;  
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private RolesService : RolesService,      
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<RolesComponent>) {}

  ngOnInit() {  
    this._adapter.setLocale('fr');  
    this.RolesService.GetRolesLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.RolesLastRecord = eval(user.payload.doc.id)+1
      })              
    })    
    this.RolesForm = this.fb.group({
      name: ['', Validators.required],
      intitule:new FormControl()
    })   
  }
  search(searchText){
    this.startAt.next(searchText);
  }  

  /* Reactive book form */
  submitRolesForm() {
    this.submitted = true;
    if (this.RolesForm.invalid) {
      return;
    }
    var iRoles : Roles = {
      id:this.RolesLastRecord,
      name:this.RolesForm.controls['name'].value,
      intitule:this.RolesForm.controls['intitule'].value
    }    
  
    this.RolesService.AddRoles(iRoles).then(
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
    return this.RolesForm.controls[controlName].hasError(errorName);
  }  

  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
  }

}
