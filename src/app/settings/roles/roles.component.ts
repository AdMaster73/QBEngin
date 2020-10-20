import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { RolesService } from '../../services/roles.service';
import { Roles } from './../../models/engin.model';

import { AngularFirestore } from 'angularfire2/firestore';
import { RolesFormComponent } from './roles-form/roles-form.component';
import { RolesAddComponent } from './roles-add/roles-add.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  displayedColumns: string[] = ['action','numero', 'designation','intitule','listerChantier'];
  dataSource : MatTableDataSource<Roles>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;

  constructor(
    public db : AngularFirestore,
    private rolesServices : RolesService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.rolesServices.GetRolesList().subscribe(
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
  /** Ajouter nouveau Roles */
  addRoles(): void{
    const dialogRef = this.dialog.open(RolesAddComponent);
  }
  /**Modifier Roles */
  editRoles(index:number, element){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(RolesFormComponent,{data:{
      id:element.id,
      name:element.name,
      intitule:element.intitule,
      listerChantier:element.listerChantier
    }}).afterClosed().subscribe(result => {
      if (result){
        this.rolesServices.UpdateRoles(result)
      }
    });
  }
  /* Delete */
  deleteRoles(index: number){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.rolesServices.DeleteRoles(index)
    }
  }

}
