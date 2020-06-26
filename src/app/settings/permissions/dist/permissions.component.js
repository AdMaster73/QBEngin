"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PermissionsComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var paginator_1 = require("@angular/material/paginator");
var rxjs_1 = require("rxjs");
var PermissionsComponent = /** @class */ (function () {
    function PermissionsComponent(db, collectionsService, rolesServices, dialog) {
        var _this = this;
        this.db = db;
        this.collectionsService = collectionsService;
        this.rolesServices = rolesServices;
        this.dialog = dialog;
        this.displayedColumns = ['user', 'list', 'add', 'update', 'delete', 'accessoire'];
        this.asyncTabs = new rxjs_1.Observable(function (observer) {
            _this.collectionsService.GetCollectionsList().subscribe(function (result) {
                observer.next(result);
            });
        });
    }
    PermissionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rolesServices.GetRolesList().subscribe(function (data) {
            _this.dataSource = new material_1.MatTableDataSource(data);
        });
    };
    PermissionsComponent.prototype.applyFilter = function (event) {
        var filterValue = event.target.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            this.dataSource.sort = this.sort;
        }
    };
    PermissionsComponent.prototype.checkElement = function (element, id) {
        return element ? element.includes(id) : false;
    };
    PermissionsComponent.prototype.checkRoles = function (type, id, collId, $event) {
        var typeRoles = type;
        var rolesId = id;
        var collectionId = collId;
        if ($event.checked) {
            this.rolesServices.addRolesCollections(typeRoles, rolesId, collectionId);
        }
        else {
            this.rolesServices.deleteRolesCollections(typeRoles, rolesId, collectionId);
        }
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: true })
    ], PermissionsComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort, { static: true })
    ], PermissionsComponent.prototype, "sort");
    PermissionsComponent = __decorate([
        core_1.Component({
            selector: 'app-permissions',
            templateUrl: './permissions.component.html',
            styleUrls: ['./permissions.component.scss']
        })
    ], PermissionsComponent);
    return PermissionsComponent;
}());
exports.PermissionsComponent = PermissionsComponent;
