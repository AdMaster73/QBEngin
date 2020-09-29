import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { RegionListComponent } from '../region-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Region } from 'src/app/models/engin.model';
import { RegionService } from 'src/app/services/region.service';

@Component({
  selector: 'app-region-add',
  templateUrl: './region-add.component.html',
  styleUrls: ['./region-add.component.scss']
})
export class RegionAddComponent implements OnInit {

  submitted = false;
  EnginLastRecord: number;
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  @ViewChild('resetRegionForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  RegionForm: FormGroup;
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private regionService : RegionService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<RegionListComponent>) {}

  ngOnInit() {
    this._adapter.setLocale('fr');
    this.regionService.GetRegionLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.EnginLastRecord = eval(user.payload.doc.id)+1
      })
    })
    this.RegionForm = this.fb.group({
      name: ['', Validators.required]
    })
  }
  search(searchText){
    this.startAt.next(searchText);
  }

  /* Reactive book form */
  submitRegionForm() {
    this.submitted = true;
    if (this.RegionForm.invalid) {
      return;
    }
    var iregion : Region = {
      id:this.EnginLastRecord,
      name:this.RegionForm.controls['name'].value,
      compte:''
    }

    this.regionService.AddRegion(iregion).then(
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
    return this.RegionForm.controls[controlName].hasError(errorName);
  }

  /* Reset form */
  closeForm() {
    this.dialogRef.close();
  }

}
