import { Component} from '@angular/core';
import 'rxjs/add/observable/interval';
import { Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: "app-root",
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	  secondes: number;
	  counterSubscription: Subscription;
	  isAuth : number;
    //private _jsonURL = 'assets/mouvements.json';

	  constructor(private http: HttpClient,private afs: AngularFirestore) {
      /* this.getJSON().subscribe(data => {
        data.forEach(mouvements => {
          var date_mvt_string = new Date(mouvements.date_mvt).getFullYear()
          if(date_mvt_string.toString() == '2021'){
                this.afs.collection('charges').doc(date_mvt_string.toString())
              .collection('mouvements')
              .doc(mouvements.id)
              .set({
                code_materiel: mouvements.code_materiel,
                libelle_materiel:mouvements.libelle_materiel,
                num_bon:mouvements.num_bon,
                code_artice:mouvements.code_artice,
                nom_produit:mouvements.nom_produit,
                num_mvt : mouvements.num_mvt,
                qte:eval(mouvements.qte),
                cout_mvt:eval(mouvements.cout_mvt),
                date_mvt:new Date(mouvements.date_mvt)
              })
          }else{
              return
          }
        });
       }); */
    }
    /* public getJSON(): Observable<any> {
      return this.http.get(this._jsonURL);
    } */
}
