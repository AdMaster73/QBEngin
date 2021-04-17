import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { CollectionsService } from '../../services/collections.service';
import { Collections } from './../../models/engin.model';

import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionsFormComponent } from './collections-form/collections-form.component';
import { CollectionsAddComponent } from './collections-add/collections-add.component';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  constructor(
    public db : AngularFirestore,
    private rollectionsServices : CollectionsService,
    public dialog: MatDialog) {}
  displayedColumns: string[] = ['action','order', 'designation','intitule','toolTipe','icon'];
  dataSource : MatTableDataSource<Collections>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit(): void {
    this.rollectionsServices.GetCollectionsList().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data.sort((a,b)=>a.order-b.order));
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
  /** Ajouter nouveau Collections */
  addCollections(): void{
    const dialogRef = this.dialog.open(CollectionsAddComponent);
  }
  /**Modifier Collections */
  editCollections(index:number, element){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(CollectionsFormComponent,{data:{
      id:element.id,
      name:element.name,
      intitule:element.intitule,
      toolTipe:element.toolTipe,
      icon:element.icon,
      order:element.order,
    }}).afterClosed().subscribe(result => {
      if (result){
        this.rollectionsServices.UpdateCollections(result)
      }
    });
  }
  /* Delete */
  deleteCollections(index: number){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.rollectionsServices.DeleteCollections(index)
    }
  }

}
