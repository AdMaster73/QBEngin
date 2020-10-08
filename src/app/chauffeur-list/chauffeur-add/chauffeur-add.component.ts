import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { ChauffeurListComponent } from '../chauffeur-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Chauffeur } from 'src/app/models/engin.model';
import { ChauffeurService } from 'src/app/services/chauffeur.service';

@Component({
  selector: 'app-chauffeur-add',
  templateUrl: './chauffeur-add.component.html',
  styleUrls: ['./chauffeur-add.component.scss']
})
export class ChauffeurAddComponent implements OnInit {


  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  ChauffeurLastRecord: number;
  Chauffeurs: Chauffeur[];
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');


  @ViewChild('resetChauffeurForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  ChauffeurForm: FormGroup;
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private ChauffeurService : ChauffeurService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<ChauffeurListComponent>) {}

  ngOnInit() {
    this._adapter.setLocale('fr');
    this.ChauffeurService.GetChauffeurLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.ChauffeurLastRecord = eval(user.payload.doc.id)+1
      })
    })
    this.ChauffeurForm = this.fb.group({
      name: ['', Validators.required]
    })
  }
  search(searchText){
    this.startAt.next(searchText);
  }

  /* Reactive book form */
  submitChauffeurForm() {
    this.submitted = true;
    if (this.ChauffeurForm.invalid) {
      return;
    }
    if(!this.ChauffeurLastRecord) this.ChauffeurLastRecord = 1
    var iChauffeur : Chauffeur = {
      id:this.ChauffeurLastRecord,
      name:this.ChauffeurForm.controls['name'].value
    }

    this.ChauffeurService.AddChauffeur(iChauffeur).then(
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
    return this.ChauffeurForm.controls[controlName].hasError(errorName);
  }

  /* Reset form */
  closeForm() {
    this.dialogRef.close();
  }

}
