import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { EnginService } from 'src/app/services/engin.service';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from 'src/app/services/chantier.service';
import { Engin } from 'src/app/models/engin.model';

@Component({
  selector: 'app-encours-add',
  templateUrl: './encours-add.component.html',
  styleUrls: ['./encours-add.component.scss']
})
export class EncoursAddComponent implements OnInit {

  options: string[] = [];
  optionsC: string[] = []
  optionsD: string[] = []
  filteredEngins: Observable<string[]>;
  filteredChantiers: Observable<string[]>
  filteredChantiersD: Observable<string[]>
  typeOfTransfert:string;
  engins_provenance :Observable<Engin[]>;
  engins_destination :Observable<Engin[]>;
  transfertFormGroup: FormGroup;
  secondFormGroup: FormGroup
  typeFormGroup: FormGroup
  constructor(private enginService: EnginService,private _formBuilder: FormBuilder,
    private chantierService: ChantierService) {}
  radioChange(event: MatRadioChange) {
    this.typeOfTransfert = event.value
  }
  ngOnInit() {
    this.transfertFormGroup = this._formBuilder.group({
      typeControl: [],
      myControl : new FormControl(''),
      myControlC : new FormControl('',[Validators.required]),
      myControlD : new FormControl('',[Validators.required])
    })
    this.enginService.GetEnginList().subscribe(data=>{
      data.forEach(engin=>{
        this.options.push(engin.code+' => '+engin.name)
      })
    })
    this.chantierService.GetChantierList().subscribe(data=>{
      data.forEach(chantier=>{
        this.optionsC.push(chantier.id+' => '+chantier.name)
      })
    })
    this.chantierService.GetChantierList().subscribe(data=>{
      data.forEach(chantier=>{
        this.optionsD.push(chantier.id+' => '+chantier.name)
      })
    })

    this.filteredEngins = this.transfertFormGroup.get('myControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_engin(value))
      );
    this.filteredChantiers = this.transfertFormGroup.get('myControlC').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter_chantier(value))
    );
    this.filteredChantiersD = this.transfertFormGroup.get('myControlD').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter_chantierD(value))
    );
  }

  private _filter_engin(value: string): string[] {
    if(value === null){
      return
    }
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter_chantier(value: string): string[] {
    if(value === null){
      return
    }
    const filterValue = value.toLowerCase();

    return this.optionsC.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter_chantierD(value: string): string[] {
    if(value === null){
      return
    }
    const filterValue = value.toLowerCase();

    return this.optionsD.filter(option => option.toLowerCase().includes(filterValue));
  }
  getControls(event$,type:string){
    let id_chantier = event$.option.value.split('=>')[0]
    if(type === 'chantier'){
      this.engins_provenance = this.enginService.GetEnginListBySite(id_chantier)
    }else{
      this.engins_destination = this.enginService.GetEnginListBySite(id_chantier)
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log(1)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event.previousContainer.data)
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
