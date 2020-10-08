import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MatDialogRef, MatSelect, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Chantier } from 'src/app/models/engin.model';
import { ChantierService } from 'src/app/services/chantier.service';
import { PointageListComponent } from '../pointage-list.component';
import { map, startWith } from 'rxjs/operators';
import {DragDropModule, transferArrayItem} from '@angular/cdk/drag-drop';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pointage-add',
  templateUrl: './pointage-add.component.html',
  styleUrls: ['./pointage-add.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class PointageAddComponent implements OnInit {

  PointageFormAdd: FormGroup
  PointageFormAddSecond: FormGroup
  PointageFormAddFirst: FormGroup
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
    this.engin_etat = this.data.etat_f
    this.compteur_etat = this.data.etat_k
    if(this.data.etat_f == 'MARCHE'){
      this.heure_m=10
      this.heure_p=0
      this.heure_ar=0
    }else if(this.data.etat_f == 'ARRET'){
      this.heure_m=0
      this.heure_p=0
      this.heure_ar=10
    }else if(this.data.etat_f == 'PANNE'){
      this.heure_m=0
      this.heure_p=10
      this.heure_ar=0
    }else{
      this.heure_m=0
      this.heure_p=0
      this.heure_ar=0
    }
    this.minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    if(this.data.id_chantier){
      this.chantierService.getChantierById(this.data.id_chantier).subscribe(chantiers=>{
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
      date_pointage:new FormControl(Validators.required),
      etat_f: new FormControl(),
      vidange: new FormControl(),
      id_chantier: new FormControl(),
      heure_m: new FormControl(),
      heure_ar: new FormControl(),
      heure_p: new FormControl(),
      gasoil: new FormControl(),
      bon: new FormControl(),
      etat_compt: new FormControl({value:this.data.etat_k}, Validators.required),
      compteur_anc: new FormControl({ value: '', disabled: true }),
      compteur_nvx: new FormControl(this.data.compteur, [Validators.min(this.data.compteur)]),
      consomation: new FormControl(),
      oil_10: new FormControl(),
      oil_40: new FormControl(),
      oil_90: new FormControl()
    });
    this.PointageFormAdd.get('oil_10').setValue(0)
    this.PointageFormAdd.get('oil_40').setValue(0)
    this.PointageFormAdd.get('oil_90').setValue(0)
    this.PointageFormAdd.get('gasoil').setValue(0)
    this.PointageFormAdd.get('consomation').setValue(0)
    this.PointageFormAdd.get('bon').setValue('')
    this.PointageFormAdd.get('date_pointage').setValue(new Date())
    this.PointageFormAdd.get('gasoil').valueChanges.subscribe(value => {
      var consomation = (value*100)/(this.PointageFormAdd.get('compteur_nvx').value-this.PointageFormAdd.get('compteur_anc').value)
      if(consomation == Infinity){
        return
      }else if(this.PointageFormAdd.get('compteur_nvx').value-this.PointageFormAdd.get('compteur_anc').value == 0){
        this.PointageFormAdd.get('consomation').setValue(0)
        return
      }else if(consomation < 0){
        this.PointageFormAdd.get('consomation').setValue(0)
      }else{
        this.PointageFormAdd.get('consomation').setValue(Math.round(consomation))
      }
    })

    this.PointageFormAdd.get('compteur_nvx').valueChanges.subscribe(value => {
      var consomation = (this.PointageFormAdd.get('gasoil').value*100)/(value-this.PointageFormAdd.get('compteur_anc').value)
      if(consomation == Infinity){
        return
      }else if(value-this.PointageFormAdd.get('compteur_anc').value == 0){
        this.PointageFormAdd.get('consomation').setValue(0)
        return
      }else if(consomation < 0){
        this.PointageFormAdd.get('consomation').setValue(0)
      }else{
        this.PointageFormAdd.get('consomation').setValue(Math.round(consomation))
      }
    })

    this.PointageFormAdd.get('heure_m').valueChanges.subscribe(value => {
      let heure_arr = this.PointageFormAdd.get('heure_ar').value
      let heure_pan = this.PointageFormAdd.get('heure_p').value
      if(heure_arr+heure_pan+value > 10){
        this.PointageFormAdd.get('heure_m').setValue(10-(heure_arr+heure_pan))
      }
    })

    this.PointageFormAdd.get('heure_ar').valueChanges.subscribe(value => {
      let heure_ma = this.PointageFormAdd.get('heure_m').value
      let heure_pan = this.PointageFormAdd.get('heure_p').value
      if(heure_ma+heure_pan+value > 10){
        this.PointageFormAdd.get('heure_ar').setValue(10-(heure_ma+heure_pan))
      }
    })

    this.PointageFormAdd.get('heure_p').valueChanges.subscribe(value => {
      let heure_ma = this.PointageFormAdd.get('heure_m').value
      let heure_arr = this.PointageFormAdd.get('heure_ar').value
      if(heure_ma+this.heure_ar+value > 10){
        this.PointageFormAdd.get('heure_p').setValue(10-(heure_ma+heure_arr))
      }
    })

    this.PointageFormAdd.get('compteur_nvx').valueChanges.subscribe(value => {
      var consomation = (this.PointageFormAdd.get('gasoil').value*100)/(value-this.PointageFormAdd.get('compteur_anc').value)
      if(consomation == Infinity){
        return
      }else if(value-this.PointageFormAdd.get('compteur_anc').value == 0){
        this.PointageFormAdd.get('consomation').setValue(0)
        return
      }else if(consomation < 0){
        this.PointageFormAdd.get('consomation').setValue(0)
      }else{
        this.PointageFormAdd.get('consomation').setValue(Math.round(consomation))
      }
    })

    this.PointageFormAdd.get('etat_f').valueChanges.subscribe(value => {
      switch (value) {
        case 'MARCHE':
          this.PointageFormAdd.get('heure_p').setValue(0)
          this.PointageFormAdd.get('heure_ar').setValue(0)
          this.PointageFormAdd.get('heure_m').setValue(10)
          break;
        case 'ARRET':
          this.PointageFormAdd.get('heure_m').setValue(0)
          this.PointageFormAdd.get('heure_p').setValue(0)
          this.PointageFormAdd.get('heure_ar').setValue(10)
          break;
        case 'MAD':
          this.PointageFormAdd.get('heure_m').setValue(0)
          this.PointageFormAdd.get('heure_p').setValue(0)
          this.PointageFormAdd.get('heure_ar').setValue(0)
          break;
        case 'PANNE':
          this.PointageFormAdd.get('heure_m').setValue(0)
          this.PointageFormAdd.get('heure_ar').setValue(0)
          this.PointageFormAdd.get('heure_p').setValue(10)
          break;
        case 'EN ATTENTE':
          this.PointageFormAdd.get('heure_m').setValue(0)
          this.PointageFormAdd.get('heure_p').setValue(0)
          this.PointageFormAdd.get('heure_ar').setValue(0)
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
  /** */
  getControls(event$){
    this.PointageFormAdd.controls['id_chantier'].setValue(eval(event$.option.id))
    this.PointageFormAdd.controls['myControl'].setValue(event$.option.value)
  }

    /* Get errors */
    public handleError = (controlName: string, errorName: string) => {
      return this.PointageFormAdd.controls[controlName].hasError(errorName);
    }

}
