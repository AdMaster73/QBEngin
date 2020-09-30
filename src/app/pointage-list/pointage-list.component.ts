import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from '../services/engin.service';
import { Engin, Pointage } from './../models/engin.model';
import * as firebase from 'firebase';
import { PointageService } from '../services/pointage.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { RegionService } from '../services/region.service';
import { ChantierService } from '../services/chantier.service';

@Component({
  selector: 'app-pointage-list',
  templateUrl: './pointage-list.component.html',
  styleUrls: ['./pointage-list.component.scss']
})
export class PointageListComponent implements OnInit {

  regions$: Observable<any[]>;
  sites$: Observable<any[]>;
  selectionSite:string=''
  constructor(
    public db : AngularFirestore,
    private enginService : EnginService,
    private pointageService : PointageService,
    public regionService : RegionService,
    public chantierService : ChantierService,
    public dialog: MatDialog) { }
    displayedColumnsObj = [
      {"value":'transfert',"show": true},
      {"value":'numero',"show": false},
      {"value":'code',"show": true},
      {"value":'designation',"show": true},
      {"value":'categorie',"show": true},
      {"value":'id_site',"show": false},
      {"value":'b_code',"show": true},
      {"value":'etat_f',"show": false}
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
  dataSource : MatTableDataSource<Engin>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit(): void {
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
    this.regions$ = this.regionService.GetRegionList();
    this.sites$ = this.chantierService.GetChantierListNnArchived();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }
  /** Filter les engin par leur site */
  getEnginsBySite(siteId:string,site:string){
    //const dialogRef = this.dialog.open(CategorieAddComponent);
    this.selectionSite = 'Filtrage par : '+site
    this.enginService.GetEnginListBySite(siteId).subscribe(
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
  /** Actualiser la liste des engins */
  actualiser(){
    this.selectionSite = ''
    //const dialogRef = this.dialog.open(CategorieAddComponent);
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
}
