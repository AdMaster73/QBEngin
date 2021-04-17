import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { startWith, map } from 'rxjs/operators';
import { RolesService } from 'src/app/services/roles.service';
import { CollectionsService } from 'src/app/services/collections.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Roles, Collections } from 'src/app/models/engin.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase';

@Component({
  selector: 'app-permissions-form',
  templateUrl: './permissions-form.component.html',
  styleUrls: ['./permissions-form.component.scss']
})
export class PermissionsFormComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  roleCtrl = new FormControl();
  filteredRoles: Observable<Roles[]>;
  roles: Roles[] = [];

  allRoles: Roles[]=[];
  selectedValue: string;
  
  @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;
  @ViewChild('roleInput',{static: true}) roleInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion,{static:true}) accordion: MatAccordion
  constructor(
    public collectionsService : CollectionsService,
    public rolesService: RolesService,
    public authservice: AuthService,    
    @Inject(MAT_DIALOG_DATA) public data:Collections) {      
      this.rolesService.GetRolesList().subscribe((result)=>{
        this.allRoles = result
      })
      this.filteredRoles = this.roleCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allRoles.slice()));                  

       /* this.collectionsService.listRolesCollections(data.id).subscribe(
        (roleList)=> {                     
          this.roles = roleList
        }
      ) */  
      
        this.roleCtrl.valueChanges.pipe(
          startWith(null),
          map((role: string | null) => role ? this._filter(role) : this.allRoles.slice()));   
  }

  private _filter(value: string): Roles[] {
    const filterValue = value;
    return this.allRoles.filter(role => role.name.includes(filterValue)); /* role.email.indexOf(filterValue) === 0 */
  }

  ngOnInit() {           
  }

  add(event$): void {
    const input = event$.input;
    const value = event$.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.collectionsService.addCollectionsRoles((this.data.id).toString(),event$.option.value)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
 
  selected(event$) {    
    
    this.collectionsService.addCollectionsRoles((this.data.id).toString(),event$.option.value)       
    this.roleInput.nativeElement.value = '';
    this.roleCtrl.setValue(null);    
  }

  remove(role: Roles): void {
    const index = this.roles.indexOf(role);
    this.collectionsService.deleteCollectionsRoles((this.data.id).toString(),role)
    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  } 
}
