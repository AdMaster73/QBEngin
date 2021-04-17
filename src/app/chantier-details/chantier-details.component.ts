import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {Router} from '@angular/router'
import { Observable } from 'rxjs';
import { Chantier, Engin } from '../models/engin.model';
import { EnginService } from '../services/engin.service';

@Component({
  selector: 'app-chantier-details',
  templateUrl: './chantier-details.component.html',
  styleUrls: ['./chantier-details.component.scss']
})
export class ChantierDetailsComponent implements OnInit {

  chantier : Chantier;
  dataSource : MatTableDataSource<Engin>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  displayedColumnsObj = [
    {"value":'transfert',"show": true},
    {"value":'code',"show": true},
    {"value":'b_code',"show": true},
    {"value":'designation',"show": true},
    {"value":'categorie',"show": true},
    {"value":'fournisseur',"show": true},
    {"value":'chauffeur',"show": true}
    ];

  get displayedColumns(): string[]{
    return this.displayedColumnsObj.filter(
      (element) => {
        return element.show == true
      }).map(
        (element) =>
        {
          return element.value
        });
  }
  constructor(private enginService : EnginService,private router : Router) {
    if(this.router.getCurrentNavigation() == null){
      this.router.navigate(['/sidenav'])
      return
    }
    if(this.router.getCurrentNavigation().extras == null){
      this.router.navigate(['/sidenav'])
      return
    }
    if(this.router.getCurrentNavigation().extras.state == null){
      this.router.navigate(['/sidenav'])
      return
    }
    if(this.router.getCurrentNavigation().extras.state.chantier == null){
      this.router.navigate(['/sidenav'])
      return
    }
    if(this.router.getCurrentNavigation().extras.state.chantier.queryParams == null){
      this.router.navigate(['/sidenav'])
      return
    }
    if(this.router.getCurrentNavigation().extras.state.chantier.queryParams.chantier == null){
      this.router.navigate(['/sidenav'])
      return
    }
    this.chantier = this.router.getCurrentNavigation().extras.state.chantier.queryParams.chantier
  }

  ngOnInit() {
    if(this.chantier.engins.length ==0){
      this.dataSource = new MatTableDataSource();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.paginator._intl.itemsPerPageLabel = 'Affichage par page.';
          this.paginator._intl.firstPageLabel = 'Page Premier';
          this.paginator._intl.nextPageLabel = 'Page Suivant';
          this.paginator._intl.previousPageLabel = 'Page Précédante';
          this.paginator._intl.lastPageLabel = 'Dérnier Page';
    }else{
      this.enginService.GetEnginListByIdArray(this.chantier.engins).subscribe(
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
