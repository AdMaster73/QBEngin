import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { startWith, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ChantierService } from 'src/app/services/chantier.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Chantier, Engin } from 'src/app/models/engin.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase'
import { EnginService } from 'src/app/services/engin.service';

@Component({
  selector: 'app-engin-accessoire',
  templateUrl: './engin-accessoire.component.html',
  styleUrls: ['./engin-accessoire.component.scss']
})
export class EnginAccessoireComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  enginCtrl = new FormControl();
  filteredEngins: Observable<Engin[]>;
  engins: Engin[] = [];

  users: Observable<User[]>;
  allChantiers: Engin[]=[];
  selectedValue: string;

  @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;
  @ViewChild('enginInput',{static: true}) enginInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion,{static:true}) accordion: MatAccordion

  constructor(
    public enginService: EnginService,
    public authservice: AuthService,
    @Inject(MAT_DIALOG_DATA) public data:Engin) {
      this.enginService.GetEnginListAccessoire().subscribe((result)=>{
        this.allChantiers = result
      })
      this.filteredEngins = this.enginCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allChantiers.slice()));

       this.enginService.listEnginAccessoire(this.data.id).subscribe(
        (chantierList)=> {
          this.engins = chantierList
        }
      )

        this.enginCtrl.valueChanges.pipe(
          startWith(null),
          map((chantier: string | null) => chantier ? this._filter(chantier) : this.allChantiers.slice()));
     }
     private _filter(value: string): Engin[] {
      const filterValue = value;
      return this.allChantiers.filter(chantier => chantier.code.includes(filterValue)); /* chantier.email.indexOf(filterValue) === 0 */
    }
  ngOnInit() {
  }

  add(event$): void {
    const input = event$.input;
    const value = event$.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.enginService.addAccessoireEngin((this.data.id).toString(),event$.option.value)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  selected(event$) {
    this.enginService.addAccessoireEngin((this.data.id).toString(),event$.option.value)
    this.enginInput.nativeElement.value = '';
    this.enginCtrl.setValue(null);
  }

  remove(user: Engin): void {
    const index = this.engins.indexOf(user);
    this.enginService.deleteAccessoireEngin((this.data.id).toString(),user)
    if (index >= 0) {
      this.engins.splice(index, 1);
    }
  }
}
