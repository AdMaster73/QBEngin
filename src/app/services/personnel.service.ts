import { Injectable } from '@angular/core';
import { Personnel, IPersonnelResponse, User, IUserResponse } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, switchMap } from 'rxjs/operators';
import firebase, { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { combineLatest, Observable } from 'rxjs';
import { ChantierService } from './chantier.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  private baseUrl = 'https://us-central1-admater-a06e8.cloudfunctions.net/api/users'

	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth,public chantierService:ChantierService,private http: HttpClient) {}

  /*** */

  get users$(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${this.baseUrl}`).pipe(
      map(result => {
        return result.users
      })
    )
  }

  	/*Retourner une liste des chantier */
	GetUsersListSearch():Observable<IUserResponse> {
    return new Observable(subscriber => {
      this.users$.subscribe(users=>{
        subscriber.next({
          total: users.length,
          results: users
        });
      })
    });
	}

  /** */
  deleteChantierPersonnel(personnel: Personnel) {
    this.afs.doc('personnel/'+personnel.id).update({
			id_chantier:firebase.firestore.FieldValue.delete()
		})
  }

  listChantierPersonnel(chantierID){
		return this.afs.collection('personnel',ref=>ref.where('id_chantier','==',chantierID))
    .snapshotChanges().pipe(
      map(result => {
        return result.map(a=>{
          const data = a.payload.doc.data() as Personnel;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
	}

  /**affectation du chantier au personnel */
  addChantierToPersonnel(id: string, personnel: any) {
    this.afs.doc('personnel/'+personnel.id).update({
			id_chantier:id
		})
  }
	/* Créer une nouvelle Personnel */
	AddPersonnel(personnel: Personnel){ 
    let date_pointage = new Date()
    date_pointage.setDate(date_pointage.getDate()-1)       
    let numberOfNow:number = new Date().getDate()
    var idPending : string = ""
    let year = new Date().getFullYear()
    let month = new Date().getDay()
    let minAmbauche = personnel.minAmbauche
    let uid_pointeur = personnel.pointeur_uid
    let dateDiffAmbQuianzine:number = date_pointage.getDate()-minAmbauche.getDate()
    if(numberOfNow<10){
      idPending = year.toString()+'0'+month.toString()+'0'+numberOfNow
    }else{
      idPending = year.toString()+month.toString()+numberOfNow
    }            
		this.afs.collection('personnel').doc(personnel.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
      f_name: personnel.f_name.toUpperCase(),
			l_name: personnel.l_name,
			matricule: personnel.matricule,
			cin: personnel.cin,
      date_naissance:personnel.date_naissance,
      date_ambauche:personnel.date_ambauche,
      pending:1,
      heure_pp:9,
      totalMois:0,
      last_day:date_pointage.getDate(),
      type_pointage:personnel.type_pointage,
      id_pending:idPending,
      deplacement:personnel.deplacement,
      id_chantier:personnel.id_chantier,
      type_contrat:{
        id:eval(personnel.type_contrat.id.toString()),
        name:personnel.type_contrat.name
      },
      duree_contrat:personnel.duree_contrat,
      archive:0
		},{merge:true})    
    for (let index = minAmbauche.getDate(); index <= minAmbauche.getDate()+dateDiffAmbQuianzine; index++) {      
      let id_pointage
      if(minAmbauche.getDate()==1){
        id_pointage = minAmbauche.getFullYear()+''+minAmbauche.getMonth()+1+'0'+index
      }else{
        id_pointage = minAmbauche.getFullYear()+''+minAmbauche.getMonth()+1+''+index
      }      
      this.afs.collection('personnel/'+personnel.id+'/pointage').doc(id_pointage).set(
        {
          id_chantier:personnel.id_chantier,
          date_ep:new Date(),
          date_p:new Date(minAmbauche.getFullYear(),minAmbauche.getMonth()+1,index),      
          uid:uid_pointeur,
          numero:index,
          heure_p:0
        },{merge:true})
      }
      return this.afs.collection('personnel/'+personnel.id+'/pending').doc(idPending).set({
        uid:this.firebaseAuth.auth.currentUser.uid,
        date_pending:firestore.FieldValue.serverTimestamp()      
      })     
  }

  GetPersonnelListSearch():Observable<IPersonnelResponse> {
    return new Observable(subscriber => {
      this.getPersonnelList().subscribe(Personnels=>{
        subscriber.next({
          total: Personnels.length,
          results: Personnels
        });
      })
    });
}

	/* Supprimer la Personnel */
	async DeletePersonnel(id) {
		this.afs.doc('personnel/'+id).delete()
	}
  get personnels$(): Observable<Personnel[]> {
    return this.afs.collection<Personnel>('personnel').snapshotChanges().pipe(
      map(result => {
        return result.map(a=>{
          const data = a.payload.doc.data() as Personnel;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }
	/* Retourn une liste des Personnels */
	getPersonnelList() {
    return this.afs.collection<Personnel>('personnel')
    .snapshotChanges()
    .pipe(
      switchMap((personnels)=>{
        const engin = personnels.map(c=>{
          var id_chantier :string
          var id  = c.payload.doc.id
          if(c.payload.doc.data().id_chantier){
            id_chantier = c.payload.doc.data().id_chantier.toString()
          }else{
            id_chantier = '249'
          }
          return this.chantierService.getChantierById(id_chantier)
          .pipe(
            map(chantiers=>Object.assign(c.payload.doc.data(),{chantiers,id}))
          )
        })
        return combineLatest(...engin)
      })
		);
	}

	//Retourne le ID du dernier enregistrement
	GetPersonnelLastRecord(){
	  return this.afs.collection('personnel', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier la Personnel */
	UpdatePersonnel(personnel) {
		this.afs.doc('personnel/'+personnel.id).update({
			updatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			f_name: personnel.f_name.toUpperCase(),
			l_name: personnel.l_name.toUpperCase(),
			cin: personnel.cin.toUpperCase(),
			date_naissance: personnel.date_naissance,
			matricule: personnel.matricule,
			date_ambauche: personnel.date_ambauche,
      duree_contrat:personnel.duree_contrat?personnel.duree_contrat:0,
      type_pointage:personnel.type_pointage,
      heure_pp:personnel.heure_pp,
      deplacement:personnel.deplacement,
      fonction:{
        id:eval(personnel.fonction.id.toString()),
        name:personnel.fonction.name
      },
      type_contrat:{
        id:eval(personnel.type_contrat.id.toString()),
        name:personnel.type_contrat.name
      },
		})
	}
}
