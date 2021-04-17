import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from './../../services/engin.service';
import { Engin, Chantier } from './../../models/engin.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { PointageService } from 'src/app/services/pointage.service';
import { FormGroup, FormBuilder,FormControl, Validators } from '@angular/forms';
import   localeFr from '@angular/common/locales/fr';
import { formatDate, registerLocaleData  } from '@angular/common';
import { startWith, map } from 'rxjs/operators';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MM-yyyy',this.locale)/* dd MMM-yyyy */
      } else {
          return date.toDateString()
      }
  }
}

@Component({
  selector: 'app-pointage-chantier-list',
  templateUrl: './pointage-chantier-list.component.html',
  styleUrls: ['./pointage-chantier-list.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}
]
})

export class PointageChantierListComponent implements OnInit {

  step = 0;
  chantierSelected:string = "Chantier"
  changeEngin:string = 'Engin'
  changeDate:string=""
  maxDate:Date = new Date()
  minDate:Date = new Date()
  chantiers$: Observable<Chantier[]>;
  selectedOptions=[];
  selectedOption: string = "";
  isLinear = false;
  isEditable = false;
  chantierFormGroup: FormGroup;
  dateFormGroup: FormGroup;
  EnginData: any = [];
  optionsEngin: string[] = [];
  optionsChantier: string[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private pointageService:PointageService,
    private enginService : EnginService,
    private _adapter: DateAdapter<any>,
    public dialog: MatDialog) {
      this._adapter.setLocale('fr');
      registerLocaleData(localeFr, 'fr');
      this.maxDate.setDate(this.maxDate.getDate()-1)
    }
  displayedColumns: string[] = ['numero', 'code', 'designation', 'categorie','fournisseur','b_code'];
  dataSource : MatTableDataSource<Engin>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');
  ngOnInit(): void {
    this.chantiers$ = this.pointageService.getChantierByUser()
    this.enginService.GetEnginList().subscribe(engins=>{
      engins.forEach(engin=>{
        this.optionsEngin.push(engin.code+' => '+engin.name)
      })
    })
      this.dateFormGroup = this._formBuilder.group({
        date_debut_pointage: new FormControl(),
        date_fin_pointage: new FormControl()
      })
      this.dateFormGroup
      .valueChanges
      .subscribe(x => {
        this.minDate = x.date_debut_pointage;
      });
      this.chantierFormGroup = this._formBuilder.group({
        chantierShoes: ['', Validators.required]
      })
  }

  onNgModelChange($event){
    this.selectedOption=$event;
  }

  refresh(dateD:string,dateF:string){
    let dated = new Date(dateD)
    let datef = new Date(dateF)
    let selectChantiers = this.selectedOption
    this.enginService.GetEnginList().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel = 'Affichage par page.';
        this.paginator._intl.firstPageLabel = 'Page Premier';
        this.paginator._intl.nextPageLabel = 'Page Suivant';
        this.paginator._intl.previousPageLabel = 'Page Précédante';
        this.paginator._intl.lastPageLabel = 'Dérnier Page';
      }
    )
  }
  popDataSource(){
    this.dataSource = new MatTableDataSource([])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
