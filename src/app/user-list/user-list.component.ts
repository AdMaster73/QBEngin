import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/engin.model';
import { UserService } from '../services/user.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserAddComponent } from './user-add/user-add.component';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService,
          public db : AngularFirestore,
          public dialog: MatDialog
    ) {}
  displayedColumns: string[] = ['numero', 'nom','email','login','action'];
  dataSource : MatTableDataSource<User>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort; 
  ngOnInit() {
      this.userService.GetUserList().subscribe(
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
    /** Ajouter nouveau Fournisseur */
    addUser(): void{
      const dialogRef = this.dialog.open(UserAddComponent);
    }
    /**Modifier Fournisseur */
    editUser(index:number, element){   
      const dialogConfig = new MatDialogConfig();            
      dialogConfig.autoFocus = true 
      dialogConfig.data = element
      this.dialog.open(UserFormComponent,dialogConfig)                            
    }
    /* Delete */
    deleteUser(index: number){    
      if(window.confirm('Are you sure?')) {
        const data = this.dataSource.data;
        data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
        this.dataSource.data = data;
        this.userService.DeleteUser(index)
      }
    }

}
