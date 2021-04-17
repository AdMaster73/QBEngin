import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { PersonnelListComponent } from '../personnel-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Personnel, TypeOfContrat,ITypeOfContratResponse,TypeOfContratClass } from 'src/app/models/engin.model';
import { PersonnelService } from 'src/app/services/personnel.service';
import { TypeOfContratService } from 'src/app/services/type-of-contrat.service';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-personnel-add',
  templateUrl: './personnel-add.component.html',
  styleUrls: ['./personnel-add.component.scss']
})
export class PersonnelAddComponent implements OnInit {

  submitted = false;
  EnginLastRecord: number;
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  filteredContrats: TypeOfContrat[] = [];
  isLoading = false;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  @ViewChild('resetPersonnelForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  PersonnelForm: FormGroup;
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      public typeOfContratService : TypeOfContratService,
      private personnelService : PersonnelService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<PersonnelListComponent>) {}

  ngOnInit() {
    this._adapter.setLocale('fr');
    this.personnelService.GetPersonnelLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.EnginLastRecord = eval(user.payload.doc.id)+1
      })
    })
    this.PersonnelForm = this.fb.group({
      l_name: ['', Validators.required],
      f_name: ['', Validators.required],
      date_naissance: ['', Validators.required],
      date_ambauche: ['', Validators.required],
      type_contrat: [''],
      duree_contrat: ['']
    })
    this.PersonnelForm.get('type_contrat')
    .valueChanges
    .pipe(
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchT({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((fonctions)=>this.filteredContrats = fonctions.results );
  }
  search(searchText){
    this.startAt.next(searchText);
  }

  searchT(filter: {name: string} = {name: ''}): Observable<ITypeOfContratResponse>{
    let filterString:string = filter.name == undefined ? '' : filter.name
    if (typeof( filter.name) === 'object') {
      if(filter.name['name'] == 'CDI'){
        this.PersonnelForm.controls['duree_contrat'].disable()
      }else{
        this.PersonnelForm.controls['duree_contrat'].enable()
      }
      filterString = filter.name['name']
    }
    return this.typeOfContratService.GetTypeOfContratListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((typeOfContrat)=>new TypeOfContratClass(
          typeOfContrat.id,
          typeOfContrat.name
          ))
        .filter(typeOfContrat => typeOfContrat.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }

  displayFn(fonction: TypeOfContrat): string {
    return fonction && fonction.name ? fonction.name : '';
  }

  /* Reactive book form */
  submitPersonnelForm() {
    this.submitted = true;
    if (this.PersonnelForm.invalid) {
      return;
    }
    var iPersonnel : Personnel = {
      id:this.EnginLastRecord == undefined?1:this.EnginLastRecord,
      f_name:this.PersonnelForm.controls['f_name'].value,
      l_name:this.PersonnelForm.controls['l_name'].value,
      date_naissance:this.PersonnelForm.controls['date_naissance'].value,
      date_ambauche:this.PersonnelForm.controls['date_ambauche'].value,
      type_contrat:this.PersonnelForm.controls['type_contrat'].value,
      duree_contrat:this.PersonnelForm.controls['duree_contrat'].value,
    }

    this.personnelService.AddPersonnel(iPersonnel).then(
      res => {
        this.dialogRef.close();
      }
    ).catch(
      err=>{
        alert('Vous avez mal tappez les champs !')
      }
    )
  }
  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.PersonnelForm.controls[controlName].hasError(errorName);
  }

  /* Reset form */
  closeForm() {
    this.dialogRef.close();
  }
}
