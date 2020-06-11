import { Application } from "express";
import { create,all,get,patch,remove} from "./controller";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

export function routesConfig(app: Application) {    
app.post('/users',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin','pointeur' , 'dex' , 'dtu' , 'charge' , 'manager' , 'conducteur'] }),
    create
);
// lists all users
app.get('/users', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin','pointeur' , 'dex' , 'dtu' , 'charge' , 'manager' , 'conducteur'] }),
    all
]);
// get :id user
app.get('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin','pointeur' , 'dex' , 'dtu' , 'charge' , 'manager' , 'conducteur'], allowSameUser: true }),
    get
]);
// updates :id user
app.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin','pointeur' , 'dex' , 'dtu' , 'charge' , 'manager' , 'conducteur'], allowSameUser: true }),
    patch
]);
// deletes :id user
app.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin','pointeur' , 'dex' , 'dtu' , 'charge' , 'manager' , 'conducteur'] }),
    remove
]);    
 }