"use strict";
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
exports.EnginListComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var paginator_1 = require("@angular/material/paginator");
var engin_add_component_1 = require("./engin-add/engin-add.component");
var engin_form_component_1 = require("./engin-form/engin-form.component");
var firebase = require("firebase");
var engin_accessoire_component_1 = require("./engin-accessoire/engin-accessoire.component");
var EnginListComponent = /** @class */ (function () {
    function EnginListComponent(enginService, rolesService, collectionService, dialog) {
        var _this = this;
        this.enginService = enginService;
        this.rolesService = rolesService;
        this.collectionService = collectionService;
        this.dialog = dialog;
        this.EnginData = [];
        this.displayedColumnsObj = [
            { "value": 'action', "show": true },
            { "value": 'numero', "show": false },
            { "value": 'code', "show": true },
            { "value": 'designation', "show": true },
            { "value": 'categorie', "show": true },
            { "value": 'fournisseur', "show": true },
            { "value": 'b_code', "show": true },
            { "value": 'etat_f', "show": false }
        ];
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var roleCurrentUser, collectionId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, firebase.auth().currentUser.getIdTokenResult()];
                    case 1: return [4 /*yield*/, (_a.sent()).claims.role];
                    case 2:
                        roleCurrentUser = _a.sent();
                        this.collectionService.GetCollectionsByName('engin').subscribe(function (collections) {
                            collections.map(function (collection) {
                                collectionId = collection.id;
                            });
                        });
                        this.rolesService.getRolesByNameAndType(roleCurrentUser).subscribe(function (roles) {
                            roles.forEach(function (item) {
                                _this.collectionPermAdd = item.add.includes(collectionId.toString());
                                _this.collectionPermUpdate = item.update.includes(collectionId.toString());
                                _this.collectionPermDelete = item["delete"].includes(collectionId.toString());
                                _this.collectionPermAccessoire = item.accessoire.includes(collectionId.toString());
                                !_this.collectionPermUpdate && !_this.collectionPermDelete ? _this.collectionMenuToggel = false : _this.collectionMenuToggel = true;
                            });
                        });
                        return [2 /*return*/];
                }
            });
        }); })();
    }
    Object.defineProperty(EnginListComponent.prototype, "displayedColumns", {
        get: function () {
            return this.displayedColumnsObj.filter(function (element) {
                return element.show == true;
            }).map(function (element) {
                return element.value;
            });
        },
        enumerable: false,
        configurable: true
    });
    EnginListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.enginService.GetEnginList().subscribe(function (data) {
            _this.dataSource = new material_1.MatTableDataSource(data);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            _this.paginator._intl.itemsPerPageLabel = 'Affichage par page.';
            _this.paginator._intl.firstPageLabel = 'Page Premier';
            _this.paginator._intl.nextPageLabel = 'Page Suivant';
            _this.paginator._intl.previousPageLabel = 'Page Précédante';
            _this.paginator._intl.lastPageLabel = 'Dérnier Page';
        });
    };
    EnginListComponent.prototype.applyFilter = function (event) {
        var filterValue = event.target.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            this.dataSource.sort = this.sort;
        }
    };
    /** Ajouter nouveau Engin */
    EnginListComponent.prototype.addEngin = function () {
        var dialogRef = this.dialog.open(engin_add_component_1.EnginAddComponent);
    };
    /**Modifier Engin */
    EnginListComponent.prototype.editEngin = function (element) {
        var _this = this;
        this.dialog.open(engin_form_component_1.EnginFormComponent, { data: {
                id: element.id,
                code: element.code,
                name: element.name,
                date_achat: element.date_achat,
                valeur_achat: element.valeur_achat,
                n_serie: element.n_serie,
                marque_moteur: element.marque_moteur,
                serie_moteur: element.serie_moteur,
                b_code: element.b_code,
                categorie: {
                    id: element.categorie.id,
                    name: element.categorie.name
                },
                fournisseur: {
                    id: element.fournisseur.id,
                    name: element.fournisseur.name
                },
                type_v: element.type_v,
                etat_f: element.etat_f,
                etat_k: element.etat_k,
                accessoire_v: element.accessoire_v,
                compteur: element.compteur
            } }).afterClosed().subscribe(function (result) {
            if (result) {
                _this.enginService.UpdateEngin(result);
            }
        });
    };
    /* Delete */
    EnginListComponent.prototype.deleteEngin = function (index) {
        if (window.confirm('Are you sure?')) {
            var data = this.dataSource.data;
            data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
            this.dataSource.data = data;
            this.enginService.DeleteEngin(index);
        }
    };
    /** */
    EnginListComponent.prototype.getBackgroundColor = function (etat) {
        switch (etat) {
            case 'MARCHE':
                return '';
                break;
            case 'ARRET':
                return 'green';
                break;
            case 'MAD':
                return 'blue';
                break;
            case 'EN ATTENTE':
                return 'white';
                break;
            case 'PANNE':
                return 'red';
                break;
            default:
                break;
        }
    };
    EnginListComponent.prototype.accessoireEngin = function (engin) {
        this.dialog.open(engin_accessoire_component_1.EnginAccessoireComponent, { data: engin }).afterClosed().subscribe(function (_) {
        });
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: true })
    ], EnginListComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort, { static: true })
    ], EnginListComponent.prototype, "sort");
    EnginListComponent = __decorate([
        core_1.Component({
            selector: 'app-engin-list',
            templateUrl: './engin-list.component.html',
            styleUrls: ['./engin-list.component.scss']
        })
    ], EnginListComponent);
    return EnginListComponent;
}());
exports.EnginListComponent = EnginListComponent;
