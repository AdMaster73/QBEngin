import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs';
import { Chantier } from 'src/app/models/engin.model';
import { ChantierService } from 'src/app/services/chantier.service';
import { PointageListComponent } from '../pointage-list.component';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-pointage-add',
  templateUrl: './pointage-add.component.html',
  styleUrls: ['./pointage-add.component.scss']
})
export class PointageAddComponent implements OnInit {

  PointageFormAdd: FormGroup
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl()
  chantier_name:string=''
  maxDate:Date =  new Date();
  Etat_Array=['MARCHE','ARRET','MAD','PANNE','EN ATTENTE']
  @ViewChild('resetEnginForm',{static: true}) myNgForm : NgForm;
  constructor(public fb: FormBuilder ,
    public chantierService:ChantierService,
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<PointageListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this._adapter.setLocale('fr');
    if(this.data.chantier){
      this.chantierService.getChantierById(this.data.chantier).subscribe(chantiers=>{
        chantiers.forEach(chantier=>{
          this.chantier_name = chantier.name
        })
      })
    }
    this.chantierService.getChantierByUser().subscribe(chantiers=>{
      chantiers.forEach(chantier=>{
        this.options.push(chantier.id+'//'+chantier.name)
      })
    })
    this.PointageFormAdd= this.fb.group({
      name: [],
      id_chantier: [],
      gasoil: [],
      h10: [],
      h40: [],
      h90: [],
      etat_compt: new FormControl(this.data.engin.etat_k, Validators.required),
      compteur_anc: new FormControl({ value: '', disabled: true }),
      compteur_nvx: new FormControl(this.data.engin.compteur, [Validators.required,Validators.min(this.data.engin.compteur)]),
      consomation: new FormControl({ value: '', disabled: true }),
      date_pointage:new FormControl(new Date(), Validators.required),
      code:[]
    });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_chantier(value))
      );
  }
  private _filter_chantier(value: string): string[] {
    if(value === null){
      return
    }
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.PointageFormAdd.controls[controlName].hasError(errorName);
  }

/** */
  getControls(event$){
    this.myControl.setValue(event$.option.value)
    this.PointageFormAdd.controls['id_chantier'].setValue(event$.option.id)
  }

    /* Reset form */
    closeForm() {
      this.dialogRef.close();
    }

}
