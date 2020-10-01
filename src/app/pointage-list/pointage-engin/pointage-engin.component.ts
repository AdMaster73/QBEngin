import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from './../../services/engin.service';
import { Engin, Pointage, User } from 'src/app/models/engin.model';
import { Observable } from 'rxjs';
import { PointageService } from 'src/app/services/pointage.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pointage-engin',
  templateUrl: './pointage-engin.component.html',
  styleUrls: ['./pointage-engin.component.scss']
})
export class PointageEnginComponent implements OnInit {

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl()
  engin: any
  constructor(
    private enginService: EnginService,
    private router:Router,
    private pointageService:PointageService) {
      this.engin = this.router.getCurrentNavigation().extras.state.engins
      this.pointageService.getPointageByEngin(this.engin).subscribe(
        data => {
          this.dataSource = new MatTableDataSource(data.sort((a,b)=>(
            a.payload.doc.data().date_pointage.slice(3, 5)+a.payload.doc.data().date_pointage.slice(0, 2)+a.payload.doc.data().date_pointage.slice(6, 10) < b.payload.doc.data().date_pointage.slice(3, 5)+b.payload.doc.data().date_pointage.slice(0, 2)+b.payload.doc.data().date_pointage.slice(6, 10) ? -1 : 1
              )));
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

  displayedColumns: string[] = ['date_pointage', 'chantier', 'type_p', 'etat_e','heure_m','heure_ar','heure_p','displayName'];
  dataSource : MatTableDataSource<Pointage>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit(): void {


    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_engin(value))
      );
  }

  private _filter_engin(value: string): string[] {
    if(value === null){
      return
    }
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }


    /** */
    getBackgroundColor(etat: string): String {
      switch (etat) {
        case 'MARCHE':
          return ''
          break;
        case 'ARRET':
          return 'rgb(88, 78, 78)'
          break;
        case 'MAD':
          return 'rgb(148, 204, 241)'
          break;
        case 'EN ATTENTE':
          return 'yellow'
          break;
        case 'PANNE':
          return 'red'
          break;

        default:
          break;
      }
    }

}
