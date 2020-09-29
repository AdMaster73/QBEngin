
export interface Engin {
    id: number;
    code: string;
    name:string;
    date_achat:Date;
    valeur_achat: string;
    n_serie: string;
    marque_moteur: string;
    serie_moteur: string;
    categorie:Categorie;
    fournisseur:Fournisseur
  }
  export interface Categorie{
    id:number,
    name:string,
    compte:string,
  }
  export interface Fournisseur{
    id:number,
    name:string,
    compte:string
  }
  export interface Chantier{
    id:number,
    name:string,
    compte:string,
    archive:number,
    region:string
  }
  export interface chantierUser{
    createdBy: string
    displayName: string
    email: string
    role: string
    uid: string
  }
  export interface User{
    uid:string,
    email:string,
    displayName: string,
    role?:string
  }
  export interface Roles{
    id:number,
    name:string,
    intitule:string,
    list?:string[],
    add?:string[],
    update?:string[],
    delete?:string[],
    accessoire?:string[]
  }
  export interface Collections{
    id:number,
    name:string,
    intitule?:string,
    toolTipe?:string,
    icon?:string,
    order?:number
  }
  export interface Permissions{
    id:number,
    collection:Collections,
    /* list:Roles,
    add:Roles,
    update:Roles,
    delete:Roles */
  }
  export interface Transfert{
    id:number,
    uid:string,
    date_t:Date,
    chantier_p:Chantier,
    chantier_d:Chantier,
    porte_char:Engin,
    niveau_gasoil:string,
    etat_engin:Etat_engin_Transfert
  }
  export enum Etat_engin_Transfert{
    BIEN,MAUVAIS,FERAI
  }
  export enum Etat_engin{
    MARCHE,ARRET,MAD,ENATTENTE,PANNE
  }
  export enum Type_vidange{
    HEURE,KILOMETRAGE
  }

  export interface Notification{
    uid:string,
    first_validation?:firebase.User[],
    second_validation?:firebase.User[],
    dex_dtu?:firebase.User[],
    type:string,
    engin:Engin,
    etat:number,
    destination?:Chantier,
    provenance?:Chantier,
    description?:string,
    message?:string,
    createdBy?:string,
    createdAt?:Date,
    updateBy?:string,
    updatedAt?:Date
  }

  export interface Region {
    id:number;
    name:string;
    compte:string
  }

  export interface Pointage{
    id?:string,
    chantier:string,
    chantier_id?:string,
    etat_e:string,
    gasoil:string[],
    heure_ar:number,
    heure_m:number,
    heure_p:number,
    localisation:Localisation,
    lubrifiant:number[],
    type_p:string,
    uid:string
 }
 export interface Localisation{
   altitude:number,
   longtitude:number
 }
