import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { User } from 'firebase';
import { UserService } from '../services/user.service';
import { MatTableDataSource, MatSort, MatDialog, MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserAddComponent } from './user-add/user-add.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UserFormService } from '../services/userFormService';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, switchMap } from 'rxjs/operators';
@NgModule({
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ]
})
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  user$: Observable<User>
  constructor(private userService: UserService,
          public db : AngularFirestore,
          private afAuth: AngularFireAuth,
          public dialog: MatDialog,
          private authService: AuthService,
          private userForm: UserFormService,
          public router: Router
    ) {
      /* iconRegistry.addSvgIcon(
        'thumbs-up',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/person_add-24px.svg')); */
    }
  displayedColumns: string[] = ['action','nom','email','creationTime','tele','role'];
  dataSource : MatTableDataSource<User>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit() {
      this.authService.users$.subscribe(
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

      this.user$ = this.afAuth.user.pipe(
        filter(user => !!user),
        switchMap(user => this.authService.user$(user.uid))
      )

    }
    setColorRole(color) {
      return color === 'admin' ? 'primary' : 'undefined'
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
      this.userForm.create();
      this.dialog.open(UserAddComponent).afterClosed().subscribe(_=>{
        this.authService.users$.subscribe(users=>{
          this.dataSource.connect().next(users)
        })
      })
    }
    /**Modifier Fournisseur */
    editUser(element){
      this.dialog.open(UserFormComponent,{data:{
        uid:element.uid,
        displayName:element.displayName,
        email:element.email,
        password:element.password,
        phoneNumber:element.phoneNumber,
        role:element.role
      }}).afterClosed().subscribe(user => {
        if (user){
          this.authService.edit(user).subscribe(_ =>{
            this.authService.users$.subscribe(users=>{
              this.dataSource.connect().next(users)
            })
          })
        }
      });
    }

    /* Delete */
    deleteUser(element){
      this.dialog.open(UserDeleteComponent,{data:{
        uid:element.uid,
        displayName:element.displayName,
        email:element.email,
        password:element.password,
        role:element.role,
        photoURL:element.photoURL,
        emailVerified:element.emailVerified,
        creationTime:element.creationTime,
        lastSignInTime:element.lastSignInTime
      }}).afterClosed().subscribe(result =>
        {
          if(result){
            this.authService.remove(result)
            this.authService.users$.subscribe(users=>{
              this.dataSource.connect().next(users)
            })
          } else{
            this.dialog.closeAll()
          }
        })
      /* if(window.confirm('Are you sure?')) {
        const data = this.dataSource.data;
        data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
        this.dataSource.data = data;
        this.userService.DeleteUser(index)
      } */
    }

}
