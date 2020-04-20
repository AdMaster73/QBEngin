import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-main-dashoard',
  templateUrl: './main-dashoard.component.html',
  styleUrls: ['./main-dashoard.component.scss']
})
export class MainDashoardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'DP',libel:'34247.18',purcent:10,trending:'up',color:'primary', cols: 1, rows: 1,notification:true,numberCols:1,date:'01/12/2020' },
          { title: 'DS',libel:'26500',purcent:30,trending:'up',color:'accent', cols: 1, rows: 1,notification:true,numberCols:2,date:'01/12/2020' },
          { title: 'DPS',libel:'39496.36',purcent:20,trending:'down',color:'warn', cols: 1, rows: 1,notification:true,numberCols:3,date:'01/12/2020' },
          { title: 'DM',libel:'40128.69',purcent:40,trending:'up',color:'primary', cols: 1, rows: 1,notification:true,numberCols:4,date:'01/12/2020' },
          { title: 'DS',libel:'1250.25',purcent:40,trending:'',color:'', cols: 2, rows: 2,notification:false,numberCols:1,date:'01/12/2020' },
          { title: '',libel:'',purcent:40,trending:'',color:'', cols: 2, rows: 2,notification:false,numberCols:2,date:'01/12/2020' },
          { title: '',libel:'',purcent:40,trending:'up',color:'primary', cols: 4, rows: 3,notification:false,numberCols:1,date:'01/12/2020' },          
        ];
      }

      return [
          { title: 'DP',libel:'34247.18',purcent:10,trending:'up',color:'primary', cols: 1, rows: 1,notification:true,numberCols:1,date:'01/12/2020' },
          { title: 'DS',libel:'26500',purcent:30,trending:'up',color:'accent', cols: 1, rows: 1,notification:true,numberCols:2,date:'01/12/2020' },
          { title: 'DPS',libel:'39496.36',purcent:20,trending:'down',color:'warn', cols: 1, rows: 1,notification:true,numberCols:3,date:'01/12/2020' },
          { title: 'DM',libel:'40128.69',purcent:40,trending:'up',color:'primary', cols: 1, rows: 1,notification:true,numberCols:4,date:'01/12/2020' },
          { title: 'DS',libel:'1250.25',purcent:0,trending:'',color:'', cols: 2, rows: 2,notification:false,numberCols:1,date:'01/12/2020' },
          { title: '',libel:'',purcent:40,trending:'',color:'', cols: 2, rows: 2,notification:false,numberCols:2,date:'01/12/2020' },
          { title: '',libel:'',purcent:0,trending:'up',color:'primary', cols: 4, rows: 3,notification:false,numberCols:1,date:'01/12/2020' },          
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
