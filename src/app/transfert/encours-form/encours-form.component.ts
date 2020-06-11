import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { EnginService } from 'src/app/services/engin.service';
import { startWith, map } from 'rxjs/operators';
import { ChantierService } from 'src/app/services/chantier.service';

@Component({
  selector: 'app-encours-form',
  templateUrl: './encours-form.component.html',
  styleUrls: ['./encours-form.component.scss']
})
export class EncoursFormComponent implements OnInit {

  options: string[] = [];  
  optionsC: string[] = []
  filteredEngins: Observable<string[]>;
  filteredChantiers: Observable<string[]>
  myControl = new FormControl()
  myControlC = new FormControl()
  constructor(
    private enginService: EnginService,
    private chantierService: ChantierService) { }

  ngOnInit() {

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

    this.filteredEngins = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_engin(value))
      );  
    this.filteredChantiers = this.myControlC.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter_chantier(value))
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

}
