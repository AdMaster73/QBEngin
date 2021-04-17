import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import { Chantier, Personnel } from 'src/app/models/engin.model';
import { Observable } from 'rxjs';
import { PersonnelService } from 'src/app/services/personnel.service';
import { map, startWith } from 'rxjs/operators';
import { ChantierService } from 'src/app/services/chantier.service';

@Component({
  selector: 'app-chantier-personnel',
  templateUrl: './chantier-personnel.component.html',
  styleUrls: ['./chantier-personnel.component.scss']
})
export class ChantierPersonnelComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  personneCtrl = new FormControl();
  filteredPersonnes: Observable<Personnel[]>;
  chantiers: Personnel[] = [];

  users: Observable<Personnel[]>;
  allPersonnes: Personnel[]=[];

  @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;
  @ViewChild('chantierInput',{static: true}) chantierInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion,{static:true}) accordion: MatAccordion

  constructor(
    private personnelService : PersonnelService,
    @Inject(MAT_DIALOG_DATA) public data:Chantier) {
    this.personnelService.personnels$.subscribe((result)=>{
      this.allPersonnes = result
    })
    this.filteredPersonnes = this.personneCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allPersonnes.slice()));

      this.personnelService.listChantierPersonnel(this.data.id).subscribe(
        (chantierList)=> {
          this.chantiers = chantierList
        }
      )

      this.personneCtrl.valueChanges.pipe(
        startWith(null),
        map((personne: string | null) => personne ? this._filter(personne) : this.allPersonnes.slice()));

  }

  private _filter(value: string): Personnel[] {
    if(typeof(value) !== 'string'){
      return
    }
    const filterValue = value;
    return this.allPersonnes.filter(personne => personne.f_name.toUpperCase().includes(filterValue.toUpperCase())); /* chantier.email.indexOf(filterValue) === 0 */
  }

  ngOnInit() {
  }

  selected(event$) {

    this.personnelService.addChantierToPersonnel((this.data.id).toString(),event$.option.value)
    this.chantierInput.nativeElement.value = '';
    this.personneCtrl.setValue(null);
  }

  add(event$): void {
    const input = event$.input;
    const value = event$.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.personnelService.addChantierToPersonnel((this.data.id).toString(),event$.option.value)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(personnel: Personnel): void {
    const index = this.chantiers.indexOf(personnel);
    this.personnelService.deleteChantierPersonnel(personnel)
    if (index >= 0) {
      this.chantiers.splice(index, 1);
    }
  }

}
