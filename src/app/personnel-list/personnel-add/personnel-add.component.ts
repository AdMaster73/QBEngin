import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { PersonnelListComponent } from '../personnel-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Personnel, TypeOfContrat,ITypeOfContratResponse,TypeOfContratClass, Chantier, User, IUserResponse, UserClass } from 'src/app/models/engin.model';
import { PersonnelService } from 'src/app/services/personnel.service';
import { TypeOfContratService } from 'src/app/services/type-of-contrat.service';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { ChantierService } from 'src/app/services/chantier.service';
import { ChantierClass, IChantierResponse } from 'src/app/transfert/encours-add/encours-add.component';
import { AuthService } from 'src/app/services/auth.service';

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
  affectations: Chantier[] = [];
  users: User[] = [];
  isLoading = false;
  maxDateAmb:Date=new Date()  
  maxDate:Date = new Date(new Date().getFullYear()-18,new Date().getMonth(),new Date().getDate())
  minDate:Date = new Date(new Date().getFullYear()-65,new Date().getMonth(),new Date().getDate())
  minDateAmb:Date = new Date().getDate() < 15? new Date(new Date().getFullYear(),new Date().getMonth(),1): new Date(new Date().getFullYear(),new Date().getMonth(),16)
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
      private chantierService : ChantierService,
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
      affectation: ['', Validators.required],
      uid: ['', Validators.required],
      type_contrat: ['', Validators.required],
      duree_contrat: [''],
      matricule: [''],
      cin: [''],
      deplacement: [''],
      type_pointage: [''],
      id_chantier: [''],
      id_uid: ['']
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

    this.PersonnelForm.get('affectation')
    .valueChanges
    .pipe(
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchA({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((sites)=>this.affectations = sites.results );

    this.PersonnelForm.get('uid')
    .valueChanges
    .pipe(
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchU({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((users)=>this.users = users.results );


  }

  search(searchText){
    this.startAt.next(searchText);
  }

  searchU(filter: {name: string} = {name: ''}): Observable<IUserResponse>{
    let filterString:string = filter.name == undefined ? '' : filter.name
    if (typeof( filter.name) === 'object') {
      filterString = filter.name['name']
      this.PersonnelForm.controls['id_uid'].setValue(filter.name['uid'])
    }
    return this.personnelService.GetUsersListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((userClass)=>new UserClass(
          userClass.uid,
          userClass.displayName,
          userClass.email,userClass.role   
          ))
        .filter(user => user.displayName.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }

  searchA(filter: {name: string} = {name: ''}): Observable<IChantierResponse>{
    let filterString:string = filter.name == undefined ? '' : filter.name
    if (typeof( filter.name) === 'object') {
      filterString = filter.name['name']
      this.PersonnelForm.controls['id_chantier'].setValue(filter.name['id'])
    }
    return this.chantierService.GetChantierListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((chantierClass)=>new ChantierClass(
          chantierClass.id,
          chantierClass.name,
          chantierClass.compte,
          chantierClass.archive,
          chantierClass.region,
          chantierClass.users,
          chantierClass.engins
          ))
        .filter(chantier => chantier.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
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

  displayFnA(affectation: Chantier): string {
    return affectation && affectation.name ? affectation.name : '';
  }

  displayFnU(user: User): string {    
    return user && user.displayName ? user.displayName : '';
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
      matricule:this.PersonnelForm.controls['matricule'].value,
      cin:this.PersonnelForm.controls['cin'].value,
      deplacement:this.PersonnelForm.controls['deplacement'].value,
      type_pointage:this.PersonnelForm.controls['type_pointage'].value,
      id_chantier:this.PersonnelForm.controls['id_chantier'].value,
      pointeur_uid:this.PersonnelForm.controls['id_uid'].value,
      minAmbauche:this.minDateAmb,
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
