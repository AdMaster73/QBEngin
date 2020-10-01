import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { RegionService } from '../services/region.service';
import { Chantier, Region } from './../models/engin.model';
import { RegionAddComponent } from './region-add/region-add.component';
import { RegionFormComponent } from "./region-form/region-form.component";
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CollectionsService } from '../services/collections.service';
import { RolesService } from '../services/roles.service';
import { ChantierService } from '../services/chantier.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss']
})
export class RegionListComponent implements OnInit {

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionMenuToggel:boolean
  constructor(
    public db : AngularFirestore,
    private rolesService:RolesService,
    private collectionService: CollectionsService,
    private regionService : RegionService,
    public dialog: MatDialog) {
      (async () => {
        let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
        let collectionId :number
        this.collectionService.GetCollectionsByName('region').subscribe(collections=>{
          collections.map(collection=>{
            collectionId = collection.id
          })
        })
        this.rolesService.getRolesByNameAndType(roleCurrentUser).subscribe(roles=>{
          roles.forEach(item=>{
                this.collectionPermAdd = item.add.includes(collectionId.toString())
                this.collectionPermUpdate = item.update.includes(collectionId.toString())
                this.collectionPermDelete = item.delete.includes(collectionId.toString())
                !this.collectionPermUpdate && !this.collectionPermDelete ? this.collectionMenuToggel = false : this.collectionMenuToggel = true
          })
        })
    })();
    }
  displayedColumns: string[] = ['action','numero', 'designation','compte'];
  dataSource : MatTableDataSource<Region[]>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit(): void {
    this.regionService.GetRegionList().subscribe(
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }
  /** Ajouter nouveau Region */
  addRegion(): void{
    const dialogRef = this.dialog.open(RegionAddComponent);
  }
  /**Modifier Region */
  editRegion(index:number, element){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(RegionFormComponent,{data:{
      id:element.id,
      name:element.name,
      compte:element.compte
    }}).afterClosed().subscribe(result => {
      if (result){
        this.regionService.UpdateRegion(result)
      }
    });
  }
  /* Delete */
  deleteRegion(index: number){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.regionService.DeleteRegion(index)
    }
  }
}
