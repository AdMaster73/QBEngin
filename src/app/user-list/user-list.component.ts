import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { User } from '../models/engin.model';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../services/user.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit,OnDestroy {
  users: User[];
  userSubscription: Subscription;  
  constructor(private userService: UserService,
          public db : AngularFirestore,
          public dialog: MatDialog
    ) { }
  displayedColumns: string[] = ['numero', 'designation','compte','action'];
  dataSource : MatTableDataSource<User>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort; 
  ngOnInit() {
    this.userService.userSubject.subscribe(
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

  	this.userSubscription = this.userService.userSubject.subscribe(
		(users:User[])=>{
			this.users = users;
		}
	);
	this.userService.emitUsers();
  }
  ngOnDestroy(){
  	this.userSubscription.unsubscribe();
  }

}
