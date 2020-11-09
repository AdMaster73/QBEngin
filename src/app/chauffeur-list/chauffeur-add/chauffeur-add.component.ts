import { Component, OnInit,ViewChild  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef} from '@angular/material/dialog';
import { DateAdapter} from '@angular/material/core';
import { ChauffeurListComponent } from '../chauffeur-list.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Chauffeur, Fonction, FonctionClass, IFonctionResponse } from 'src/app/models/engin.model';
import { ChauffeurService } from 'src/app/services/chauffeur.service';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { FonctionService } from 'src/app/services/fonction.service';

@Component({
  selector: 'app-chauffeur-add',
  templateUrl: './chauffeur-add.component.html',
  styleUrls: ['./chauffeur-add.component.scss']
})
export class ChauffeurAddComponent implements OnInit {


  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isLoading = false;
  filteredFonctions: Fonction[] = [];
  ChauffeurLastRecord: number;
  Chauffeurs: Chauffeur[];
  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');


  @ViewChild('resetChauffeurForm',{static: true}) myNgForm : NgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  ChauffeurForm: FormGroup;
  constructor(
      public db : AngularFirestore,
      public fb: FormBuilder ,
      private ChauffeurService : ChauffeurService,
      public serviceFonction : FonctionService,
      private _adapter: DateAdapter<any>,
      public dialogRef: MatDialogRef<ChauffeurListComponent>) {}

  ngOnInit() {
    this._adapter.setLocale('fr');
    this.ChauffeurService.GetChauffeurLastRecord().snapshotChanges().forEach(data => {
      data.forEach(user=>{
        this.ChauffeurLastRecord = eval(user.payload.doc.id)+1
      })
    })
    this.ChauffeurForm = this.fb.group({
      name: ['', Validators.required],
      matricule: [''],
      fonction: [''],
      id_fonction: [''],
    })
    this.ChauffeurForm.get('fonction')
    .valueChanges
    .pipe(
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(value => this.search({name: value})
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((fonctions)=>this.filteredFonctions = fonctions.results );
  }
  search(filter: {name: string} = {name: ''}): Observable<IFonctionResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      this.ChauffeurForm.controls['id_fonction'].setValue(filter.name['id'])
      filterString = filter.name['name']
    }
    return this.serviceFonction.GetFonctionListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((fonction)=>new FonctionClass(
          fonction.id,
          fonction.name
          ))
        .filter(fonction => fonction.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }

  displayFn(fonction: Fonction): string {
    return fonction && fonction.name ? fonction.name : '';
  }

  /* Reactive book form */
  submitChauffeurForm() {
    this.submitted = true;
    if (this.ChauffeurForm.invalid) {
      return;
    }
    if(!this.ChauffeurLastRecord) this.ChauffeurLastRecord = 1
    var iChauffeur : Chauffeur = {
      id:this.ChauffeurLastRecord,
      name:this.ChauffeurForm.controls['name'].value,
      matricule:this.ChauffeurForm.controls['matricule'].value,
      fonction:{
        id : eval(this.ChauffeurForm.controls['fonction'].value['id']),
        name : this.ChauffeurForm.controls['fonction'].value['name']
      }
    }

    this.ChauffeurService.AddChauffeur(iChauffeur).then(
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
    return this.ChauffeurForm.controls[controlName].hasError(errorName);
  }

  /* Reset form */
  closeForm() {
    this.dialogRef.close();
  }

}
