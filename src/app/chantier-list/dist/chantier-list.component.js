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
exports.ChantierListComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var paginator_1 = require("@angular/material/paginator");
var chantier_add_component_1 = require("./chantier-add/chantier-add.component");
var chantier_form_component_1 = require("./chantier-form/chantier-form.component");
var chantier_delete_component_1 = require("./chantier-delete/chantier-delete.component");
var chantier_user_component_1 = require("./chantier-user/chantier-user.component");
var operators_1 = require("rxjs/operators");
var firebase = require("firebase");
var ChantierListComponent = /** @class */ (function () {
    function ChantierListComponent(db, authService, rolesService, collectionService, chantierService, dialog, firebaseAuth) {
        var _this = this;
        this.db = db;
        this.authService = authService;
        this.rolesService = rolesService;
        this.collectionService = collectionService;
        this.chantierService = chantierService;
        this.dialog = dialog;
        this.firebaseAuth = firebaseAuth;
        this.EnginData = [];
        this.displayedColumns = ['action', 'numero', 'designation', 'compte', 'archive'];
        this._filter_role_chantier = [];
        this.is_in_array_chantier = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var roleCurrentUser, collectionId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, firebase.auth().currentUser.getIdTokenResult()];
                    case 1: return [4 /*yield*/, (_a.sent()).claims.role];
                    case 2:
                        roleCurrentUser = _a.sent();
                        this.collectionService.GetCollectionsByName('chantier').subscribe(function (collections) {
                            collections.map(function (collection) {
                                collectionId = collection.id;
                            });
                        });
                        this.rolesService.getRolesByNameAndType(roleCurrentUser).subscribe(function (roles) {
                            roles.forEach(function (item) {
                                _this.collectionPermAdd = item.add.includes(collectionId.toString());
                                _this.collectionPermUpdate = item.update.includes(collectionId.toString());
                                _this.collectionPermDelete = item["delete"].includes(collectionId.toString());
                                !_this.collectionPermUpdate && !_this.collectionPermDelete ? _this.collectionMenuToggel = false : _this.collectionMenuToggel = true;
                            });
                        });
                        this.rolesService.getFilterRoleChantier().subscribe(function (roles) {
                            roles.forEach(function (role) {
                                if (role.name === roleCurrentUser) {
                                    _this.is_in_array_chantier = true;
                                }
                            });
                        });
                        return [2 /*return*/];
                }
            });
        }); })();
    }
    ChantierListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.chantierService.GetChantierList().subscribe(function (data) {
            _this.dataSource = new material_1.MatTableDataSource(data);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            _this.paginator._intl.itemsPerPageLabel = 'Affichage par page.';
            _this.paginator._intl.firstPageLabel = 'Page Premier';
            _this.paginator._intl.nextPageLabel = 'Page Suivant';
            _this.paginator._intl.previousPageLabel = 'Page Précédante';
            _this.paginator._intl.lastPageLabel = 'Dérnier Page';
        });
        this.user$ = this.firebaseAuth.user.pipe(operators_1.filter(function (user) { return !!user; }), operators_1.switchMap(function (user) { return _this.authService.user$(user.uid); }));
    };
    ChantierListComponent.prototype.applyFilter = function (event) {
        var filterValue = event.target.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            this.dataSource.sort = this.sort;
        }
    };
    /** Ajouter nouveau Chantier */
    ChantierListComponent.prototype.addChantier = function () {
        var dialogRef = this.dialog.open(chantier_add_component_1.ChantierAddComponent);
    };
    /**Modifier Chantier */
    ChantierListComponent.prototype.editChantier = function (element) {
        var _this = this;
        var dialogConfig = new material_1.MatDialogConfig();
        this.dialog.open(chantier_form_component_1.ChantierFormComponent, { data: {
                id: element.id,
                name: element.name,
                compte: element.compte,
                archive: element.archive
            } }).afterClosed().subscribe(function (result) {
            if (result) {
                _this.chantierService.UpdateChantier(result);
            }
        });
    };
    /* Delete */
    ChantierListComponent.prototype.deleteChantier = function (index) {
        var _this = this;
        var dialogConfig = new material_1.MatDialogConfig();
        this.dialog.open(chantier_delete_component_1.ChantierDeleteComponent, { data: {
                id: index
            } }).afterClosed().subscribe(function (result) {
            if (result) {
                var data = _this.dataSource.data;
                data.splice((_this.paginator.pageIndex * _this.paginator.pageSize) + index, 1);
                _this.dataSource.data = data;
                _this.chantierService.DeleteChantier(result);
            }
        });
    };
    /** */
    ChantierListComponent.prototype.editUser = function (chantier) {
        this.dialog.open(chantier_user_component_1.ChantierUserComponent, { data: chantier }).afterClosed().subscribe(function (_) {
        });
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: true })
    ], ChantierListComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort, { static: true })
    ], ChantierListComponent.prototype, "sort");
    ChantierListComponent = __decorate([
        core_1.Component({
            selector: 'app-chantier-list',
            templateUrl: './chantier-list.component.html',
            styleUrls: ['./chantier-list.component.scss']
        })
    ], ChantierListComponent);
    return ChantierListComponent;
}());
exports.ChantierListComponent = ChantierListComponent;
