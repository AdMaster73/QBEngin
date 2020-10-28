import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Engin, Notification } from '../models/engin.model'
import { EnginService } from './engin.service';
import {AuthService} from './auth.service'
import { ChantierService } from './chantier.service';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
    private sidenav: MatSidenav;

    constructor(
      public router: Router,
      private afs: AngularFirestore,
      private enginService: EnginService,
      private chantierService: ChantierService,
      private authService : AuthService
      ) { }

    getNotificationByUser(role){
      return this.afs.collection<Notification>('notification',
          ref=>
          {
            let query : firebase.firestore.Query = ref
            if(role === 'admin'){
              query = query.where('etat','<=',5)
            }else{
              query = query.where('etat','<=',5).where('validation','==',firebase.auth().currentUser.uid)
            }
            return query
          }
          ).snapshotChanges().pipe(
            map(action=>{
              return action.map(a=>{
                const data = a.payload.doc.data() as Notification;
                const id = a.payload.doc.id;
                var engin_id=a.payload.doc.data().engin
                const user_uid = a.payload.doc.data().uid
                const user_uid_validate = a.payload.doc.data().validation
                let engins = this.enginService.GetEnginListByIdArray([engin_id])
                let users = this.authService.user$(user_uid)
                let users_validate = this.authService.user$(user_uid_validate)
               return { id, engins,users,users_validate,...data };
              })
            })
          )
    }

    updateNotification(notification ,etat:number, engin?:Engin){
      var enginId = notification.engin
      var type:string
      switch (etat) {
        case 1://validation charge/cond
          type = "l'opération est en fase de validation par le pôle GLM."
          this.authService.users$.pipe(
            map(
              (users: firebase.User[]) => users.filter(
                (user: firebase.User) => ['glm'].includes(user['role'])
              )
            )
          ).subscribe((users: firebase.User[])=>{//User dont le role est charge ou conducteur
            this.coreUpdateNotification(notification,3,type,users[0],enginId)
          })
          break;
        case 2://validation manager/inj
          type = "l'opération est en fase de validation par le pôle GLM."
          this.authService.users$.pipe(
            map(
              (users: firebase.User[]) => users.filter(
                (user: firebase.User) => ['glm'].includes(user['role'])
              )
            )
          ).subscribe((users: firebase.User[])=>{//User dont le role est charge ou conducteur
            this.coreUpdateNotification(notification,3,type,users[0],enginId)
          })
          break;
        case 3://fase glm direct
          type = "l'opération est prise en charge par le pôle GLM."
          this.authService.users$.pipe(
            map(
              (users: firebase.User[]) => users.filter(
                (user: firebase.User) => ['chefc'].includes(user['role'])
              )
            )
          ).subscribe((users: firebase.User[])=>{//User dont le role est glm
            this.coreUpdateNotification(notification,4,type,users[0],enginId)
          })
          break;
        case 4://fase transfert encours
          type = "l'opération est encours de transfert."
          this.chantierService.getChantierByName(notification.destination).subscribe(
            (chantiers)=>{
              this.authService.users$.pipe(
                map(
                  (users: firebase.User[]) => users.filter(
                    (user: firebase.User) => chantiers[0].users.includes(user.uid)
                  )
                )
              ).subscribe((users: firebase.User[])=>{//User dont le role est glm
                let userRolePointer:firebase.User[]=[]
                if(notification.destination==='GLM KENITRA'){
                  this.authService.users$.pipe(
                    map(
                      (user: firebase.User[]) => user.filter(
                        (user: firebase.User) => user['role'] === 'glm'
                      )
                    )
                  ).subscribe(
                    (users: firebase.User[]) => {
                      userRolePointer = users.filter(user=>user['role'] === 'glm')
                      this.coreUpdateNotification(notification,5,type,userRolePointer[0],enginId)
                    }
                  )
                }else{
                  userRolePointer = users.filter(user=>user['role'] === 'pointeur')
                  this.coreUpdateNotification(notification,5,type,userRolePointer[0],enginId)
                }
              })
            }
          )
          break;
        case 5://fase terminus du transfert
          type = "l'opération est terminer."
          this.chantierService.getChantierByName(notification.destination).subscribe(
            (chantiers)=>{
              this.authService.users$.pipe(
                map(
                  (users: firebase.User[]) => users.filter(
                    (user: firebase.User) => chantiers[0].users.includes(user.uid)
                  )
                )
              ).subscribe((users: firebase.User[])=>{//User dont le role est glm
                let userRolePointer:firebase.User[]=[]
                if(notification.destination==='GLM KENITRA'){
                  this.authService.users$.pipe(
                    map(
                      (user: firebase.User[]) => user.filter(
                        (user: firebase.User) => user['role'] === 'glm'
                      )
                    )
                  ).subscribe(
                    (users: firebase.User[]) => {
                      userRolePointer = users.filter(user=>user['role'] === 'glm')
                      this.coreUpdateNotification(notification,6,type,userRolePointer[0],enginId,engin)
                    }
                  )
                }else{
                  userRolePointer = users.filter(user=>user['role'] === 'pointeur')
                  this.coreUpdateNotification(notification,6,type,userRolePointer[0],enginId,engin)
                }
              })
            }
          )
          break;
        default:
          break;
      }
    }

    coreUpdateNotification(notification,etat_updated,type,user,enginId,engin?:Engin){
      this.afs.doc('notification/'+notification.id).set({
        etat : etat_updated,
        type : type,
        validation : user.uid
      },{merge:true}).then(()=>{
        switch (etat_updated) {
          case 6:
            const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
            const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
            this.afs.doc('notification/'+notification.id).set({
              validation : firebase.firestore.FieldValue.delete()
            },{merge:true})
            this.chantierService.getChantierByName(notification.provenance).subscribe((chantiers=>{
              chantiers.forEach(chantier => {
                this.afs.doc('chantier/'+chantier.id).update({
                  marche:arrayRemove(notification.engin),
                  arret:arrayRemove(notification.engin),
                  mad:arrayRemove(notification.engin),
                  panne:arrayRemove(notification.engin),
                  attente:arrayRemove(notification.engin),
                  engins:arrayRemove(notification.engin)
                })
              });
            }))
            this.chantierService.getChantierByName(notification.destination).subscribe((chantiers=>{
              chantiers.forEach(chantier => {
                switch (engin.etat_f) {
                  case 'MARCHE':
                    this.afs.doc('chantier/'+chantier.id).update({
                      marche:arrayUnion(notification.engin),
                      engins:arrayUnion(notification.engin)
                    })
                    break;
                  case 'PANNE':
                    this.afs.doc('chantier/'+chantier.id).update({
                      panne:arrayUnion(notification.engin),
                      engins:arrayUnion(notification.engin)
                    })
                    break;
                  case 'MAD':
                    this.afs.doc('chantier/'+chantier.id).update({
                      mad:arrayUnion(notification.engin),
                      engins:arrayUnion(notification.engin)
                    })
                    break;
                  case 'EN ATTENTE':
                    this.afs.doc('chantier/'+chantier.id).update({
                      attente:arrayUnion(notification.engin),
                      engins:arrayUnion(notification.engin)
                    })
                    break;
                  case 'ARRET':
                    this.afs.doc('chantier/'+chantier.id).update({
                      arret:arrayUnion(notification.engin),
                      engins:arrayUnion(notification.engin)
                    })
                    break;
                  default:
                    break;
                }
                this.afs.doc('engin/'+enginId).set({
                  last_notified : firebase.firestore.FieldValue.delete(),
                  id_chantier:chantier.id
                },{merge:true})
              });
            }))

            break;
          default:
            this.afs.doc('engin/'+enginId).set({
              last_notified : etat_updated
            },{merge:true})
            break;
        }
      }).then(()=>
        {
          this.afs.collection('notification/'+notification.id+'/story').add({
            createdAt:firestore.FieldValue.serverTimestamp(),
            createdBy:firebase.auth().currentUser.uid,
            validation:user.uid,
            etat:etat_updated
          })
        }
      )
    }


    deleteNotification(notification){
      let etat = notification.etat
      this.afs.doc('notification/'+notification.id)
      .set({
          validation:firebase.firestore.FieldValue.delete(),
          etat:firebase.firestore.FieldValue.delete(),
          type : 'suppression de transfert'},{merge:true})
      .then(()=>{
        this.afs.doc('engin/'+notification.engin).set({
          last_notified : firebase.firestore.FieldValue.delete()},{merge:true})})
      .then(()=>{
        this.afs.collection('notification/'+notification.id+'/story')
      .add({
          createdAt:firestore.FieldValue.serverTimestamp(),
          createdBy:firebase.auth().currentUser.uid,
          etat:etat,
          deletedBy : firebase.auth().currentUser.uid
        })})
    }

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public open() {
        return this.sidenav.open();
    }


    public close() {
        return this.sidenav.close();
    }

    public toggle(): void {
      this.sidenav.toggle();
   }


}
