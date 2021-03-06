import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { TransfertService } from './../../services/transfert.service';
import { Transfert } from './../../models/engin.model';
import * as firebase from 'firebase';
import { CollectionsService } from '../../services/collections.service';
import { RolesService } from '../../services/roles.service';
import { Router } from '@angular/router';
import { EncoursAddComponent } from '../encours-add/encours-add.component';

@Component({
  selector: 'app-encours',
  templateUrl: './encours.component.html',
  styleUrls: ['./encours.component.scss']
})
export class EncoursComponent implements OnInit {

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionMenuToggel:boolean
  displayedColumns: string[] = ['numero','code','designation','accessoire','destination','demandeur','provenance','accord','date'];
  dataSource : MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  constructor(
    private transfertService:TransfertService,
    private rolesService:RolesService,
    private collectionService: CollectionsService,
    public dialog: MatDialog,
    public router:Router
    ) {
    (async () => {
      let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
      let collectionId :number
      this.collectionService.GetCollectionsByName('transfert').subscribe(collections=>{
        collections.map(collection=>{
          collectionId = collection.id
        })
      })
      this.rolesService.getRolesByNameAndType(roleCurrentUser).subscribe(roles=>{
        roles.forEach(item=>{
          this.collectionPermAdd = item.add?item.add.includes(collectionId.toString()):false
          this.collectionPermUpdate = item.update?item.update.includes(collectionId.toString()):false
          this.collectionPermDelete = item.delete?item.delete.includes(collectionId.toString()):false
              !this.collectionPermUpdate && !this.collectionPermDelete ? this.collectionMenuToggel = false : this.collectionMenuToggel = true
        })
      })
  })();
  }

  ngOnInit():void {
    this.transfertService.getTransfertEnCours().subscribe(
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

    /** Ajouter nouveau transfert */
    addTransfert(): void{
      //this.router.navigate(['sidenav/transfert/add']);
      const dialogRef = this.dialog.open(EncoursAddComponent);
    }
}
