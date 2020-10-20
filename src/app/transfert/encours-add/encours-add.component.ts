import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRadioChange } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { EnginService } from 'src/app/services/engin.service';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from 'src/app/services/chantier.service';
import { Notification } from 'src/app/models/engin.model';

export interface EnginTransfert{
  code: string, name: string, etat_f :string, id_chantier :number
}
@Component({
  selector: 'app-encours-add',
  templateUrl: './encours-add.component.html',
  styleUrls: ['./encours-add.component.scss']
})
export class EncoursAddComponent implements OnInit {

  options: string[] = [];
  optionsC: string[] = []
  optionsD: string[] = []
  engins_provenance = []
  engins_destination = []
  notification : Array <Notification> = []
  engin : Array <EnginTransfert> = []
  filteredItems : Array <EnginTransfert> = []
  myArray = []
  provenance :string = 'Provenance'
  destination :string = 'Destination'
  id_destination :number
  id_provenance :number
  filteredEngins: Observable<string[]>;
  filteredChantiers: Observable<string[]>
  filteredChantiersD: Observable<string[]>
  typeOfTransfert:string;
  @ViewChild('envoyer',{static:true}) envoyer;
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
      myControlD : new FormControl({value:'',disabled:true},[Validators.required])
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
    var id_chantier = event$.option.value.split('=>')[0]
    this.optionsD = []
    if(type === 'chantier'){
      this.transfertFormGroup.get('myControlD').enable()
      this.engins_provenance = []
      this.provenance = event$.option.value.split('=>')[1]
      this.enginService.GetEnginListBySite(id_chantier).subscribe(resluts=>{
        resluts.forEach(engin=>{
          this.engins_provenance.push({code:engin.code,name:engin.name,etat_f:engin.etat_f,id_chantier:engin.id_chantier})
        })
      })
      this.chantierService.GetChantierList().subscribe(data=>{
        data.forEach(chantier=>{
          if(eval(chantier.id.toString()) !== eval(id_chantier.trim().toString())){
            this.optionsD.push(chantier.id+' => '+chantier.name)
          }
        })
      })
    }else{
      this.engins_destination = []
      this.destination = event$.option.value.split('=>')[1]
      this.id_destination = event$.option.value.split('=>')[0]
      this.enginService.GetEnginListBySite(id_chantier).subscribe(resluts=>{
        resluts.forEach(engin=>{
          this.engins_destination.push({code:engin.code,name:engin.name,etat_f:engin.etat_f,id_chantier:engin.id_chantier})
        })
      })
    }
  }

  drop(event: CdkDragDrop<{code: string, name: string, etat_f :string, id_chantier :number}[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        if(event.previousContainer.id=="cdk-drop-list-1"){
          this.engin = this.engin.filter(engin=>{
            return engin.code !== event.previousContainer.data[event.previousIndex].code
          })
          if(this.engin.length == 0){
            this.envoyer.disabled = true
          }
        }else{
          this.engin.push({
            code : event.previousContainer.data[event.previousIndex].code,
            etat_f : event.previousContainer.data[event.previousIndex].etat_f,
            id_chantier : event.previousContainer.data[event.previousIndex].id_chantier,
            name : event.previousContainer.data[event.previousIndex].name
          })
          this.envoyer.disabled = false
        }
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
      }
    }

    sendTransfert(){

    }

}
