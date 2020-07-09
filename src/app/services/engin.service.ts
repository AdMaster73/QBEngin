import { Injectable } from '@angular/core';
import { Engin } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { firestore, User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, combineLatest } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})

export class EnginService {

	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth) {
	}
	/* Créer un nouveau engin */
	AddEngin(engin: Engin){
		return this.afs.collection('engin').doc(engin.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			code: engin.code,
			name: engin.name,
			date_achat:engin.date_achat,
			valeur_achat: engin.valeur_achat,
			n_serie: engin.n_serie,
			marque_moteur: engin.marque_moteur,
			serie_moteur: engin.serie_moteur,
			categorie:{
				id :engin.categorie.id,
				name:engin.categorie.name
			},
			fournisseur:{
				id :engin.fournisseur.id,
				name:engin.fournisseur.name
			}
		})
	}

	/* Supprier un engin */
	async DeleteEngin(id) {
		this.afs.doc('engin/'+id).delete()
	}

	/*Retourner une liste des engin */
	GetEnginList() {

    /* const db = firebase.firestore()
    db.collection("engin").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          doc.ref.update({
              compteur: 0
          });
      });
    }); */
    let maintenant:string = new Date().toLocaleDateString('fr-FR')
    const db = firebase.firestore()
    db.collection("engin").where('last_pointage','==',maintenant).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          doc.ref.update({
              compteur: 0
          });
      });
    });

    return this.afs.collection<Engin>('engin',ref=> ref.orderBy('createdAt','asc'))
    .snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Engin;
				const id = a.payload.doc.id;
				return { id, ...data };
			})
			})
		)
  }
	/*Retourner une liste des engin */
	GetEnginListAccessoire() {
    return this.afs.collection<Engin>('engin',ref=> ref.where('accessoire_v','==',1))
    .snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Engin;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
  }

  //
  addAccessoireEngin(enginId:string,engin:any){
		this.afs.doc('/engin/'+enginId).update({
			accessoire:firebase.firestore.FieldValue.arrayUnion(engin.id)
    })
    this.afs.doc('/engin/'+enginId).update({
      accessoire_v:true
    })
  }
  //
  deleteAccessoireEngin(enginId:string,engin:Engin){
		const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
		this.afs.doc('/engin/'+enginId).update({
			accessoire:arrayRemove(
				engin.id
			)
		})
	}

	//Avoir le ID du dernier enregesitrement
	GetEnginLastRecord(){
	  return this.afs.collection('engin', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
  }
  //

  listEnginAccessoire(enginID):Observable<Engin[]>{
		return combineLatest(
			this.afs.doc('engin/'+enginID).valueChanges(),
			this.GetEnginList()
		).pipe(
			map(([engin,accessoire])=>{
				if(engin['accessoire'] === undefined){
					return []
				}
				return accessoire.filter(accessoire=>engin['accessoire'].includes(accessoire.id))
			}))
	}

	/* Modifier un engin */
	UpdateEngin(engin) {
    let accessoire_veh = engin.accessoire_v ? 1 : 0
		this.afs.doc('engin/'+engin.id).update(
			{
				updatedBy: this.firebaseAuth.auth.currentUser.uid,
				updatedAt: firestore.FieldValue.serverTimestamp(),
				code: engin.code,
				name: engin.name,
				date_achat: engin.date_achat,
				valeur_achat: engin.valeur_achat,
				n_serie: engin.n_serie,
				marque_moteur: engin.marque_moteur,
				serie_moteur: engin.serie_moteur,
				b_code: engin.b_code,
				categorie:{
					id:engin.categorie.id,
					name:engin.categorie.name
				},
				fournisseur:{
					id:engin.fournisseur.id,
					name:engin.fournisseur.name
        },
        type_v:engin.type_v,
        etat_f:engin.etat_f,
        etat_k:engin.etat_k,
        accessoire_v:accessoire_veh,
        compteur:engin.compteur
			}
		)
  }

  /**retoure un objet de type engin */

  getEnginById(engin){
    return this.afs.collection<Engin>('engin',ref=>ref.where(firestore.FieldPath.documentId(),'==',engin.toString())).snapshotChanges().pipe(
      map(action=>{
        return action.map(a=>{
          const data = a.payload.doc.data() as Engin;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }
}
