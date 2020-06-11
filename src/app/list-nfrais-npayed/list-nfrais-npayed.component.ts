import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { User } from '../models/User.model';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service'
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'list-nfrais-npayed',
  templateUrl: './list-nfrais-npayed.component.html',
  styleUrls: ['./list-nfrais-npayed.component.scss']
})
export class ListNfraisNpayedComponent implements OnInit {

  listUser:Observable<User[]>
  constructor(private userService : UserService) {

    this.userService.GetUserList().pipe(
        tap((value) => { 
          return of(value)         
        })
    ).subscribe((value) => {
        return of(value);  // 6
    });

   }

  ngOnInit() {
  }

}

