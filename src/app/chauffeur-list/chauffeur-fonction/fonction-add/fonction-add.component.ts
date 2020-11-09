import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { ChauffeurFonctionComponent } from '../chauffeur-fonction.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Fonction } from 'src/app/models/engin.model';
import { FonctionService } from 'src/app/services/fonction.service';

@Component({
  selector: 'app-fonction-add',
  templateUrl: './fonction-add.component.html',
  styleUrls: ['./fonction-add.component.scss']
})
export class FonctionAddComponent implements OnInit {

  submitted = false;
  EnginLastRecord: number = 1;
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  @ViewChild('resetFonctionForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  FonctionForm: FormGroup;
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private fonctionService : FonctionService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<ChauffeurFonctionComponent>) {}

  ngOnInit() {
    this._adapter.setLocale('fr');
    this.fonctionService.GetFonctionLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.EnginLastRecord = eval(user.payload.doc.id)+1
      })
    })
    this.FonctionForm = this.fb.group({
      name: ['', Validators.required]
    })
  }
  search(searchText){
    this.startAt.next(searchText);
  }

  /* Reactive book form */
  submitFonctionForm() {
    this.submitted = true;
    if (this.FonctionForm.invalid) {
      return;
    }
    var iFonction : Fonction = {
      id:this.EnginLastRecord,
      name:this.FonctionForm.controls['name'].value
    }

    this.fonctionService.AddFonction(iFonction).then(
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
    return this.FonctionForm.controls[controlName].hasError(errorName);
  }

  /* Reset form */
  closeForm() {
    this.dialogRef.close();
  }

}
