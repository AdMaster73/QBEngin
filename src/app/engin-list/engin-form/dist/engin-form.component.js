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
exports.EnginFormComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
var core_2 = require("@angular/material/core");
var fr_1 = require("@angular/common/locales/fr");
var common_1 = require("@angular/common");
var EnginFormComponent = /** @class */ (function () {
    function EnginFormComponent(fb, serviceFournisseur, serviceCategorie, _adapter, dialogRef, data) {
        var _this = this;
        this.fb = fb;
        this.serviceFournisseur = serviceFournisseur;
        this.serviceCategorie = serviceCategorie;
        this._adapter = _adapter;
        this.dialogRef = dialogRef;
        this.data = data;
        this.myFournisseur = new forms_1.FormControl();
        this.typeVs = ['HEURE', 'KILOMETRE'];
        this.etatVfs = ['MARCHE', 'ARRET', 'MAD', 'PANNE', 'EN ATTENTE'];
        this.etatVks = ['MARCHE', 'PANNE', 'INNEXISTANT'];
        this.startAt = new rxjs_1.BehaviorSubject('');
        /* Get errors */
        this.handleError = function (controlName, errorName) {
            return _this.EnginFormEdit.controls[controlName].hasError(errorName);
        };
        this._adapter.setLocale('fr');
        common_1.registerLocaleData(fr_1["default"], 'fr');
        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        this.date = typeof this.data.date_achat === 'string' ? this.date = new Date(this.data.date_achat.replace(pattern, '$3/$2/$1')) : this.date = new Date((this.data.date_achat).toDate());
        //data.accessoire_v == 1 ? this.accessoire_v = true : this.accessoire_v = false
    }
    EnginFormComponent.prototype.ngOnInit = function () {
        this.EnginFormEdit = this.fb.group({
            id: new forms_1.FormControl(),
            code: ['', forms_1.Validators.required],
            name: ['', forms_1.Validators.required],
            fournisseur: ['', forms_1.Validators.required],
            id_fournisseur: ['', forms_1.Validators.required],
            categorie: ['', forms_1.Validators.required],
            id_categorie: ['', forms_1.Validators.required],
            valeur_achat: new forms_1.FormControl(),
            date_achat: new forms_1.FormControl(this.date, forms_1.Validators.required),
            marque_moteur: new forms_1.FormControl(),
            serie_moteur: new forms_1.FormControl(),
            n_serie: new forms_1.FormControl(),
            b_code: new forms_1.FormControl('', [
                forms_1.Validators.required,
                forms_1.Validators.pattern("^[0-9]*$"),
                forms_1.Validators.minLength(6),
                forms_1.Validators.maxLength(6)
            ]),
            type_v: new forms_1.FormControl('', forms_1.Validators.required),
            etat_f: new forms_1.FormControl('', forms_1.Validators.required),
            etat_k: new forms_1.FormControl('', forms_1.Validators.required),
            accessoire_v: new forms_1.FormControl()
        });
        this.results$ = this.serviceCategorie.GetCategorieList();
        this.results_f$ = this.serviceFournisseur.GetFournisseurList();
    };
    EnginFormComponent.prototype.search = function (searchText) {
        this.startAt.next(searchText);
    };
    /** */
    EnginFormComponent.prototype.getControls = function (event$, model) {
        this.EnginFormEdit.controls[model].setValue(event$.option.value.name);
        this.EnginFormEdit.controls['id_' + model].setValue(event$.option.value.id);
    };
    __decorate([
        core_1.ViewChild('resetEnginForm', { static: true })
    ], EnginFormComponent.prototype, "myNgForm");
    EnginFormComponent = __decorate([
        core_1.Component({
            selector: 'app-engin-form',
            templateUrl: './engin-form.component.html',
            styleUrls: ['./engin-form.component.scss'],
            providers: [
                { provide: core_2.MAT_DATE_LOCALE, useValue: 'fr-FR' },
            ]
        }),
        __param(5, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], EnginFormComponent);
    return EnginFormComponent;
}());
exports.EnginFormComponent = EnginFormComponent;
