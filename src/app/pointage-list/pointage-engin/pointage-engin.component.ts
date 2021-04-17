import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from './../../services/engin.service';
import { Pointage } from 'src/app/models/engin.model';
import { Observable } from 'rxjs';
import { PointageService } from 'src/app/services/pointage.service';
import { FormControl } from '@angular/forms';
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
    }

  displayedColumns: string[] = ['date_pointage', 'chantier','mobile', 'type_p','heure_m','heure_ar','heure_p','gasoil','bon','etiquette_ancienne','etiquette_nvx','compteur','compteur_p','consomation','etat_compteur','chauffeur','displayName'];
  dataSource : MatTableDataSource<Pointage>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit(): void {
    this.pointageService.getPointageByEngin(this.engin).subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data.sort((a,b)=>(
          a.date_pointage.slice(3, 5)+a.date_pointage.slice(0, 2)+a.date_pointage.slice(6, 10) < b.date_pointage.slice(3, 5)+b.date_pointage.slice(0, 2)+b.date_pointage.slice(6, 10) ? -1 : 1
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }

  /** Gets the total heure_marche of all data. */
  getTotalHeureMarche() {
    if (!this.dataSource) return
    return this.dataSource.filteredData.map(t => t.heure_m).reduce((acc, value) => acc + value, 0);
  }

  /** Gets the total heure_marche of all data. */
  getTotalHeureArret() {
    if (!this.dataSource) return
    return this.dataSource.filteredData.map(t => t.heure_ar).reduce((acc, value) => acc + value, 0);
  }

  /** Gets the total heure_panne of all data. */
  getTotalHeurePanne() {
    if (!this.dataSource) return
    return this.dataSource.filteredData.map(t => t.heure_p).reduce((acc, value) => acc + value, 0);
  }

  /** Gets the total heure_marche of all data. */
  getTotalGasoil() {
    if (!this.dataSource) return
    return this.dataSource.filteredData.map(t => eval(t.gasoil[0])).reduce((acc, value) => acc + value, 0);
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
