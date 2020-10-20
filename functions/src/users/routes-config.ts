import { Application } from "express";
import { create,all,get,patch,remove} from "./controller";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

export function routesConfig(app: Application) {
const roleArray =['admin',//administrateur
                  'pointeur' , //pointeur
                  'dex' , //dirextion exploitation
                  'dtu' , //direction urbain
                  'charge' , //charger d'affaire
                  'manager' , // manager de l'application
                  'conducteur', //conducteur du travaux
                  'glm', // opérateur de glm
                  'dg', // directeur generale
                  'chefc', // chef de chantier
                  'chefp', // chef de poste d'enrobé
                  'chefe', // chef d'équipe
                  'chaufp', // chauffeur porte char
                  'tech', // technicien du travaux
                  'inj', // injénieur du travaux
                ]
app.post('/users',
    isAuthenticated,
    isAuthorized({ hasRole: roleArray }),
    create
);
// lists all users
app.get('/users', [
    isAuthenticated,
    isAuthorized({ hasRole: roleArray }),
    all
]);
// get :id user
app.get('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: roleArray, allowSameUser: true }),
    get
]);
// updates :id user
app.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: roleArray, allowSameUser: true }),
    patch
]);
// deletes :id user
app.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: roleArray }),
    remove
]);
 }
