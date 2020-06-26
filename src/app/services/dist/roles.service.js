"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RolesService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var firebase_1 = require("firebase");
var firebase = require("firebase");
var RolesService = /** @class */ (function () {
    function RolesService(authService, afs, firebaseAuth) {
        this.authService = authService;
        this.afs = afs;
        this.firebaseAuth = firebaseAuth;
    }
    /* Cérer un Roles */
    RolesService.prototype.AddRoles = function (Roles) {
        return this.afs.collection('roles').doc(Roles.id.toString()).set({
            createdBy: this.firebaseAuth.auth.currentUser.uid,
            createdAt: firebase_1.firestore.FieldValue.serverTimestamp(),
            name: Roles.name,
            intitule: Roles.intitule.toUpperCase()
        });
    };
    /* Supprimer un Roles */
    RolesService.prototype.DeleteRoles = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.afs.doc('roles/' + id)["delete"]();
                return [2 /*return*/];
            });
        });
    };
    /* Retourne une liste des roless */
    RolesService.prototype.GetRolesList = function () {
        return this.afs.collection('roles', function (ref) { return ref.orderBy('createdAt', 'asc'); }).snapshotChanges().pipe(operators_1.map(function (actions) {
            return actions.map(function (a) {
                var data = a.payload.doc.data();
                var id = a.payload.doc.id;
                return __assign({ id: id }, data);
            });
        }));
    };
    RolesService.prototype.getRolesByNameAndType = function (role) {
        return this.afs.collection('roles', function (ref) { return ref.where('name', '==', 'admin'); }
        /* .where('list','array-contains','1') */ ).snapshotChanges().pipe(operators_1.map(function (actions) {
            return actions.map(function (a) {
                var data = a.payload.doc.data();
                var id = a.payload.doc.id;
                return __assign({ id: id }, data);
            });
        }));
    };
    RolesService.prototype.addRolesCollections = function (typeRoles, rolesId, collectionId) {
        switch (typeRoles) {
            case 'list':
                this.afs.doc('/roles/' + rolesId).update({
                    list: firebase.firestore.FieldValue.arrayUnion(collectionId)
                });
                break;
            case 'add':
                this.afs.doc('/roles/' + rolesId).update({
                    add: firebase.firestore.FieldValue.arrayUnion(collectionId)
                });
                break;
            case 'update':
                this.afs.doc('/roles/' + rolesId).update({
                    update: firebase.firestore.FieldValue.arrayUnion(collectionId)
                });
                break;
            case 'delete':
                this.afs.doc('/roles/' + rolesId).update({
                    "delete": firebase.firestore.FieldValue.arrayUnion(collectionId)
                });
                break;
            case 'accessoire':
                this.afs.doc('/roles/' + rolesId).update({
                    accessoire: firebase.firestore.FieldValue.arrayUnion(collectionId)
                });
                break;
            default:
                break;
        }
    };
    RolesService.prototype.deleteRolesCollections = function (typeRoles, rolesId, collectionId) {
        switch (typeRoles) {
            case 'list':
                this.afs.doc('/roles/' + rolesId).update({
                    list: firebase.firestore.FieldValue.arrayRemove(collectionId)
                });
                break;
            case 'add':
                this.afs.doc('/roles/' + rolesId).update({
                    add: firebase.firestore.FieldValue.arrayRemove(collectionId)
                });
                break;
            case 'update':
                this.afs.doc('/roles/' + rolesId).update({
                    update: firebase.firestore.FieldValue.arrayRemove(collectionId)
                });
                break;
            case 'delete':
                this.afs.doc('/roles/' + rolesId).update({
                    "delete": firebase.firestore.FieldValue.arrayRemove(collectionId)
                });
                break;
            case 'accessoire':
                this.afs.doc('/roles/' + rolesId).update({
                    accessoire: firebase.firestore.FieldValue.arrayRemove(collectionId)
                });
                break;
            default:
                break;
        }
    };
    //Avoir le ID du dernier enregesitrement
    RolesService.prototype.GetRolesLastRecord = function () {
        return this.afs.collection('roles', function (ref) { return ref
            .limit(1)
            .orderBy('createdAt', 'desc'); });
    };
    /* Modifier un Roles */
    RolesService.prototype.UpdateRoles = function (roles) {
        this.afs.doc('roles/' + roles.id).update({
            updatedBy: this.firebaseAuth.auth.currentUser.uid,
            updatedAt: firebase_1.firestore.FieldValue.serverTimestamp(),
            name: roles.name,
            intitule: roles.intitule.toUpperCase(),
            listerChantier: roles.listerChantier
        });
    };
    RolesService.prototype.getFilterRoleChantier = function () {
        return this.afs.collection('roles', function (ref) { return ref.where('listerChantier', '==', true); }).snapshotChanges().pipe(operators_1.map(function (actions) {
            return actions.map(function (a) {
                var data = a.payload.doc.data();
                var id = a.payload.doc.id;
                return __assign({ id: id }, data);
            });
        }));
    };
    RolesService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], RolesService);
    return RolesService;
}());
exports.RolesService = RolesService;
