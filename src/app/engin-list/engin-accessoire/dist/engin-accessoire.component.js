"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.EnginAccessoireComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var operators_1 = require("rxjs/operators");
var forms_1 = require("@angular/forms");
var keycodes_1 = require("@angular/cdk/keycodes");
var EnginAccessoireComponent = /** @class */ (function () {
    function EnginAccessoireComponent(enginService, authservice, data) {
        var _this = this;
        this.enginService = enginService;
        this.authservice = authservice;
        this.data = data;
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.separatorKeysCodes = [keycodes_1.ENTER, keycodes_1.COMMA];
        this.enginCtrl = new forms_1.FormControl();
        this.engins = [];
        this.allChantiers = [];
        this.enginService.GetEnginListAccessoire().subscribe(function (result) {
            _this.allChantiers = result;
        });
        this.filteredEngins = this.enginCtrl.valueChanges.pipe(operators_1.startWith(null), operators_1.map(function (fruit) { return fruit ? _this._filter(fruit) : _this.allChantiers.slice(); }));
        this.enginService.listEnginAccessoire(this.data.id).subscribe(function (chantierList) {
            _this.engins = chantierList;
        });
        this.enginCtrl.valueChanges.pipe(operators_1.startWith(null), operators_1.map(function (chantier) { return chantier ? _this._filter(chantier) : _this.allChantiers.slice(); }));
    }
    EnginAccessoireComponent.prototype._filter = function (value) {
        var filterValue = value;
        return this.allChantiers.filter(function (chantier) { return chantier.code.includes(filterValue); }); /* chantier.email.indexOf(filterValue) === 0 */
    };
    EnginAccessoireComponent.prototype.ngOnInit = function () {
    };
    EnginAccessoireComponent.prototype.add = function (event$) {
        var input = event$.input;
        var value = event$.value;
        // Add our fruit
        if ((value || '').trim()) {
            this.enginService.addAccessoireEngin((this.data.id).toString(), event$.option.value);
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
    };
    EnginAccessoireComponent.prototype.selected = function (event$) {
        this.enginService.addAccessoireEngin((this.data.id).toString(), event$.option.value);
        this.enginInput.nativeElement.value = '';
        this.enginCtrl.setValue(null);
    };
    EnginAccessoireComponent.prototype.remove = function (user) {
        var index = this.engins.indexOf(user);
        this.enginService.deleteAccessoireEngin((this.data.id).toString(), user);
        if (index >= 0) {
            this.engins.splice(index, 1);
        }
    };
    __decorate([
        core_1.ViewChild('auto', { static: true })
    ], EnginAccessoireComponent.prototype, "matAutocomplete");
    __decorate([
        core_1.ViewChild('enginInput', { static: true })
    ], EnginAccessoireComponent.prototype, "enginInput");
    __decorate([
        core_1.ViewChild(material_1.MatAccordion, { static: true })
    ], EnginAccessoireComponent.prototype, "accordion");
    EnginAccessoireComponent = __decorate([
        core_1.Component({
            selector: 'app-engin-accessoire',
            templateUrl: './engin-accessoire.component.html',
            styleUrls: ['./engin-accessoire.component.scss']
        }),
        __param(2, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], EnginAccessoireComponent);
    return EnginAccessoireComponent;
}());
exports.EnginAccessoireComponent = EnginAccessoireComponent;
