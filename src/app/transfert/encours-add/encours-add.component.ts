import { Component, OnInit, Input } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { EnginService } from 'src/app/services/engin.service';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from 'src/app/services/chantier.service';

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
  provenance :string[]=[];
  destination = [];
  typeFormGroup: FormGroup;
  secondFormGroup: FormGroup
  constructor(private enginService: EnginService,private _formBuilder: FormBuilder,
    private chantierService: ChantierService) {}
  
  ngOnInit() {
    this.typeFormGroup = this._formBuilder.group({
      typeControl : new FormControl('',[Validators.required])
    })
    this.secondFormGroup = this._formBuilder.group({
      myControl : new FormControl('',[Validators.required]),
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
        this.optionsC.push(chantier.name)
      })
    })
    this.chantierService.GetChantierList().subscribe(data=>{
      data.forEach(chantier=>{
        this.optionsD.push(chantier.name)
      })
    })

    this.filteredEngins = this.secondFormGroup.get('typeControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_engin(value))
      );  
    this.filteredChantiers = this.secondFormGroup.get('myControlC').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter_chantier(value))
    );
    this.filteredChantiersD = this.secondFormGroup.get('myControlD').valueChanges
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
  getControls(event$){   
    this.chantierService.GetChantierList().subscribe(data=>{
      data.filter((chantier)=>{
        return chantier.name == event$.option.value
      }).map(
        (element) => 
        {          
          this.provenance.push(element.name)
        })
    })
  } 

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }  

}
