import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from '../services/engin.service';
import { Chantier, Engin, Pointage, Region } from './../models/engin.model';
import { Router, NavigationExtras} from '@angular/router';
import { PointageService } from '../services/pointage.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { RegionService } from '../services/region.service';
import { ChantierService } from '../services/chantier.service';
import { PointageAddComponent } from './pointage-add/pointage-add.component';
import { element } from 'protractor';

const ELEMENT_DATA: Engin[]=[]

@Component({
  selector: 'app-pointage-list',
  templateUrl: './pointage-list.component.html',
  styleUrls: ['./pointage-list.component.scss']
})
export class PointageListComponent implements OnInit {

  regions$: Observable<any[]>;
  sites$: Observable<any[]>;
  siteRegions$: Observable<any[]>;
  selectionSite:string=''
  selectionRegion:string=''
  maintenant:string = new Date().toLocaleDateString('fr-FR')
  constructor(
    public db : AngularFirestore,
    private enginService : EnginService,
    private pointageService : PointageService,
    public regionService : RegionService,
    private router:Router,
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
      {"value":'history',"show": true},
      {"value":'etat_f',"show": false},
      {"value":'site',"show": true},
      {"value":'pointage',"show": true}
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
    this.enginService.getEnginWithChantierName().subscribe(
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
  getSitesByRegion(region:Region){
    this.selectionSite = ''
    this.selectionRegion = 'Filtrage par Région : '+region.name
    this.siteRegions$ = this.chantierService.getChantierByRegion(region.name);
  }

  /** Filter les engin par leur site */
  getEnginsByRegion(site:any){
    this.dataSource = new MatTableDataSource(ELEMENT_DATA)
    this.enginService.GetEnginListBySite(site).subscribe(
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

  /**
   *
   * @param element
   */
  getPointage(element:Engin){
    let navigationExtras: NavigationExtras = {
      state: {engins:element}
    }
    this.router.navigate(['/sidenav/pointage/engins'],
     navigationExtras
    )
  }


  /** Actualiser la liste des engins */
  actualiser(){
    this.selectionSite = ''
    this.selectionRegion = ''
    this.enginService.getEnginWithChantierName().subscribe(
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

    addPointage(engin:Engin){
      this.dialog.open(PointageAddComponent,{data:engin}).afterClosed().subscribe(result => {
        if (result){
          this.pointageService.addPointage(result,engin)
        }
      });
    }
}
