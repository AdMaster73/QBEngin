import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatAccordion, MatAutocomplete } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ChantierService } from 'src/app/services/chantier.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Chantier } from 'src/app/models/engin.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase';

@Component({
  selector: 'app-chantier-user',
  templateUrl: './chantier-user.component.html',
  styleUrls: ['./chantier-user.component.scss']
})
export class ChantierUserComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chantierCtrl = new FormControl();
  filteredChantiers: Observable<User[]>;
  chantiers: User[] = [];
  
  users: Observable<User[]>;
  allChantiers: User[]=[];
  selectedValue: string;
  
  @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;
  @ViewChild('chantierInput',{static: true}) chantierInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion,{static:true}) accordion: MatAccordion
  constructor(
    public chantierService : ChantierService,
    public userService: UserService,
    public authservice: AuthService,    
    @Inject(MAT_DIALOG_DATA) public data:Chantier) {
      this.authservice.users$.subscribe((result)=>{
        this.allChantiers = result
      })
      this.filteredChantiers = this.chantierCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allChantiers.slice()));                  

       this.userService.listChantierUser(this.data.id).subscribe(
        (chantierList)=> {                     
          this.chantiers = chantierList
        }
      )  
      
        this.chantierCtrl.valueChanges.pipe(
          startWith(null),
          map((chantier: string | null) => chantier ? this._filter(chantier) : this.allChantiers.slice()));   
  }

  private _filter(value: string): User[] {
    const filterValue = value;
    return this.allChantiers.filter(chantier => chantier.email.includes(filterValue)); /* chantier.email.indexOf(filterValue) === 0 */
  }

  ngOnInit() {           
  }

  add(event$): void {
    const input = event$.input;
    const value = event$.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.userService.addChantierUser((this.data.id).toString(),event$.option.value)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
 
  selected(event$) {    
    
    this.userService.addChantierUser((this.data.id).toString(),event$.option.value)       
    this.chantierInput.nativeElement.value = '';
    this.chantierCtrl.setValue(null);    
  }

  remove(user: User): void {
    const index = this.chantiers.indexOf(user);
    this.userService.deleteChantierUser((this.data.id).toString(),user)
    if (index >= 0) {
      this.chantiers.splice(index, 1);
    }
  }   
  
}
