import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { BehaviorSubject, Observable } from 'rxjs';
import { ChantierListComponent } from '../chantier-list.component';
import { RegionService } from 'src/app/services/region.service';

@Component({
  selector: 'app-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {

  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');
  regions$: Observable<any[]>;
  ChantierFormEdit: FormGroup;
  labelSiteOptions = {
    color: 'black',
    fontFamily: '',
    fontSize: '8px',
    text: this.data.name
}
  @ViewChild('resetChantierForm',{static: true}) myNgForm : NgForm;
  constructor(
    public fb: FormBuilder ,
    public regionService : RegionService,
    public dialogRef: MatDialogRef<ChantierListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.ChantierFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      compte:[],
      archive:[],
      latitude:new FormControl(),
      longitude:new FormControl(),
      region:[]
    });
    this.regions$ = this.regionService.GetRegionList();
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.ChantierFormEdit.controls[controlName].hasError(errorName);
  }
  placeMarker($event){
      this.ChantierFormEdit.get('latitude').setValue($event.coords.lat);
      this.ChantierFormEdit.get('longitude').setValue($event.coords.lng);
  }

}
