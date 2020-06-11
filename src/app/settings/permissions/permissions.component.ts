import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog,MatCheckboxChange} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { RolesService } from '../../services/roles.service';
import { CollectionsService } from '../../services/collections.service';
import { Collections, Roles } from './../../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import {Observable, Observer} from 'rxjs'

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent  implements OnInit  {
        
  asyncTabs: Observable<Collections[]>;     
  displayedColumns: string[] = ['user','list', 'add','update','delete'];
  dataSource : MatTableDataSource<Roles>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort; 

  constructor(
    public db : AngularFirestore,
    private collectionsService:CollectionsService,
    private rolesServices : RolesService, 
    public dialog: MatDialog) {
      this.asyncTabs = new Observable((observer: Observer<Collections[]>) => {
          this.collectionsService.GetCollectionsList().subscribe(result=>{
            observer.next(result)
          })
      });
    }

  ngOnInit(): void {
    this.rolesServices.GetRolesList().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data);  
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

  checkElement(element,id){
    return element ? element.includes(id) : false
  }
  checkRoles(type,id,collId,$event:MatCheckboxChange){
    var typeRoles = type
    var rolesId = id
    var collectionId = collId
    if($event.checked){     
      this.rolesServices.addRolesCollections(typeRoles,rolesId,collectionId)
    }else{
      this.rolesServices.deleteRolesCollections(typeRoles,rolesId,collectionId)
    }    
  }

}
