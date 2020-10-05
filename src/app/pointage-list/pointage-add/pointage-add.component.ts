import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MatDialogRef, MatSelect, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Chantier } from 'src/app/models/engin.model';
import { ChantierService } from 'src/app/services/chantier.service';
import { PointageListComponent } from '../pointage-list.component';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-pointage-add',
  templateUrl: './pointage-add.component.html',
  styleUrls: ['./pointage-add.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class PointageAddComponent implements OnInit {

  PointageFormAddFirst: FormGroup
  PointageFormAddSecond: FormGroup
  PointageFormAddThird: FormGroup
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl()
  chantier_name:string=''
  maxDate:Date =  new Date();
  minDate = new Date();
  heure_m:number
  heure_p:number
  heure_ar:number
  engin_etat:string
  compteur_etat:string
  Etat_Array=['MARCHE','ARRET','MAD','PANNE','EN ATTENTE']
  constructor(public fb: FormBuilder ,
    public chantierService:ChantierService,
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<PointageListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this._adapter.setLocale('fr');
    this.engin_etat = this.data.engin.etat_f
    this.compteur_etat = this.data.engin.etat_k
    if(this.data.engin.etat_f == 'MARCHE'){
      this.heure_m=10
      this.heure_p=0
      this.heure_ar=0
    }else if(this.data.engin.etat_f == 'ARRET'){
      this.heure_m=0
      this.heure_p=0
      this.heure_ar=10
    }else if(this.data.engin.etat_f == 'PANNE'){
      this.heure_m=0
      this.heure_p=10
      this.heure_ar=0
    }else{
      this.heure_m=0
      this.heure_p=0
      this.heure_ar=0
    }
    this.minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
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

    this.PointageFormAddFirst= this.fb.group({
      date_pointage:new FormControl({value:new Date(),disabled: true}, Validators.required),
      etat_f: new FormControl(),
      heure_m: new FormControl(),
      heure_ar: new FormControl(),
      heure_p: new FormControl(),
    });

    this.PointageFormAddSecond= this.fb.group({
      gasoil: new FormControl(),
      bon: [],
      etat_compt: new FormControl({value:this.data.engin.etat_k}, Validators.required),
      compteur_anc: new FormControl({ value: '', disabled: true }),
      compteur_nvx: new FormControl(this.data.engin.compteur, [Validators.required,Validators.min(this.data.engin.compteur)]),
      consomation: new FormControl({ value: '', disabled: true }),
    });

    this.PointageFormAddThird= this.fb.group({
      h10: [],
      h40: [],
      h90: [],
    });

    this.PointageFormAddSecond.get('gasoil').valueChanges.subscribe(value => {
      var consomation = (value*100)/(this.PointageFormAddSecond.get('compteur_nvx').value-this.PointageFormAddSecond.get('compteur_anc').value)
      if(consomation == Infinity){
        return
      }else if(consomation == NaN){
        this.PointageFormAddSecond.get('consomation').setValue(0)
        return
      }else if(consomation < 0){
        this.PointageFormAddSecond.get('consomation').setValue(0)
      }else{
        this.PointageFormAddSecond.get('consomation').setValue(Math.round(consomation))
      }
    })

    this.PointageFormAddSecond.get('compteur_nvx').valueChanges.subscribe(value => {
      var consomation = (this.PointageFormAddSecond.get('gasoil').value*100)/(value-this.PointageFormAddSecond.get('compteur_anc').value)
      if(consomation == Infinity){
        return
      }else if(consomation == NaN){
        this.PointageFormAddSecond.get('consomation').setValue(0)
        return
      }else if(consomation < 0){
        this.PointageFormAddSecond.get('consomation').setValue(0)
      }else{
        this.PointageFormAddSecond.get('consomation').setValue(Math.round(consomation))
      }
    })

    this.PointageFormAddFirst.get('etat_f').valueChanges.subscribe(value => {
      switch (value) {
        case 'MARCHE':
          this.PointageFormAddFirst.get('heure_m').setValue(10)
          this.PointageFormAddFirst.get('heure_p').setValue(0)
          this.PointageFormAddFirst.get('heure_ar').setValue(0)
          this.PointageFormAddFirst.get('heure_m').enable()
          this.PointageFormAddFirst.get('heure_p').setValue(0)
          this.PointageFormAddFirst.get('heure_p').enable()
          this.PointageFormAddFirst.get('heure_ar').setValue(0)
          this.PointageFormAddFirst.get('heure_ar').enable()
          break;
        case 'ARRET':
          this.PointageFormAddFirst.get('heure_m').setValue(0)
          this.PointageFormAddFirst.get('heure_p').setValue(0)
          this.PointageFormAddFirst.get('heure_ar').setValue(10)
          this.PointageFormAddFirst.get('heure_m').enable()
          this.PointageFormAddFirst.get('heure_p').enable()
          this.PointageFormAddFirst.get('heure_ar').enable()
          break;
        case 'MAD':
          this.PointageFormAddFirst.get('heure_m').setValue(0)
          this.PointageFormAddFirst.get('heure_m').disable()
          this.PointageFormAddFirst.get('heure_p').setValue(0)
          this.PointageFormAddFirst.get('heure_p').disable()
          this.PointageFormAddFirst.get('heure_ar').setValue(0)
          this.PointageFormAddFirst.get('heure_ar').disable()
          break;
        case 'PANNE':
          this.PointageFormAddFirst.get('heure_m').setValue(0)
          this.PointageFormAddFirst.get('heure_p').setValue(10)
          this.PointageFormAddFirst.get('heure_ar').setValue(0)
          this.PointageFormAddFirst.get('heure_m').enable()
          this.PointageFormAddFirst.get('heure_p').enable()
          this.PointageFormAddFirst.get('heure_ar').enable()
          break;
        case 'EN ATTENTE':
          this.PointageFormAddFirst.get('heure_m').setValue(0)
          this.PointageFormAddFirst.get('heure_p').setValue(0)
          this.PointageFormAddFirst.get('heure_ar').setValue(0)
          this.PointageFormAddFirst.get('heure_m').disable()
          this.PointageFormAddFirst.get('heure_p').disable()
          this.PointageFormAddFirst.get('heure_ar').disable()
          break;
        default:
          break;
      }
    })


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
    return this.PointageFormAddFirst.controls[controlName].hasError(errorName);
  }

/** */
  getControls(event$){
    this.myControl.setValue(event$.option.value)
    this.PointageFormAddFirst.controls['id_chantier'].setValue(event$.option.id)
  }

    /* Reset form */
    closeForm() {
      this.dialogRef.close();
    }

    doSomething(event$){
      console.log(event$)
    }

    panneFunction(){
      this.PointageFormAddFirst.get('etat_f').setValue('PANNE')
      this.PointageFormAddFirst.get('heure_ar').setValue(0)
      this.PointageFormAddFirst.get('heure_p').setValue(10)
      this.PointageFormAddFirst.get('heure_m').setValue(0)
    }

    marcheFunction(){
      this.PointageFormAddFirst.get('etat_f').setValue('MARCHE')
      this.PointageFormAddFirst.get('heure_ar').setValue(0)
      this.PointageFormAddFirst.get('heure_p').setValue(0)
      this.PointageFormAddFirst.get('heure_m').setValue(10)
    }

    arretFunction(){
      this.PointageFormAddFirst.get('etat_f').setValue('ARRET')
      this.PointageFormAddFirst.get('heure_ar').setValue(10)
      this.PointageFormAddFirst.get('heure_p').setValue(0)
      this.PointageFormAddFirst.get('heure_m').setValue(0)
    }

}
