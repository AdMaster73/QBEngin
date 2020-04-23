import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { CategorieService } from './../../services/categorie.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateAdapter} from '@angular/material/core';
import { CategorieListComponent } from '../categorie-list.component';

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.scss']
})
export class CategorieFormComponent implements OnInit {

  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject(''); 
  date: any  
  CategorieFormEdit: FormGroup  
  @ViewChild('resetCategorieForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    private categorieService : CategorieService,
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<CategorieListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.CategorieFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required]
    });    
  }

  /* Reactive book form */
  onSubmit(categorie) {
    this.categorieService.UpdateCategorie(this.data.id,categorie)
    this.dialogRef.close();   
  }  

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.CategorieFormEdit.controls[controlName].hasError(errorName);
  }   

  search(searchText){
    this.startAt.next(searchText);
  } 
  
  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
    return false
  }
}
