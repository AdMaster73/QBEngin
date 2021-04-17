import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITypeOfContratResponse, TypeOfContrat } from '../models/engin.model';

@Injectable({
  providedIn: 'root'
})
export class TypeOfContratService {

  constructor(private afs: AngularFirestore) { }

  GetTypeOfContratListSearch():Observable<ITypeOfContratResponse> {
    return new Observable(subscriber => {
      this.GetTypeOfContratList().subscribe(typeOfContrat=>{
        subscriber.next({
          total: typeOfContrat.length,
          results: typeOfContrat
        });
      })
    });
  }
	/* Retourn une liste des Fonctions */
	GetTypeOfContratList() {
    return this.afs.collection<TypeOfContrat>('typeOfContrat')
    .snapshotChanges()
    .pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as TypeOfContrat;
        const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}
}
