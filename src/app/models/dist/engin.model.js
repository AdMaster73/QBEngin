"use strict";
exports.__esModule = true;
exports.Type_vidange = exports.Etat_engin = exports.Etat_engin_Transfert = void 0;
var Etat_engin_Transfert;
(function (Etat_engin_Transfert) {
    Etat_engin_Transfert[Etat_engin_Transfert["BIEN"] = 0] = "BIEN";
    Etat_engin_Transfert[Etat_engin_Transfert["MAUVAIS"] = 1] = "MAUVAIS";
    Etat_engin_Transfert[Etat_engin_Transfert["FERAI"] = 2] = "FERAI";
})(Etat_engin_Transfert = exports.Etat_engin_Transfert || (exports.Etat_engin_Transfert = {}));
var Etat_engin;
(function (Etat_engin) {
    Etat_engin[Etat_engin["MARCHE"] = 0] = "MARCHE";
    Etat_engin[Etat_engin["ARRET"] = 1] = "ARRET";
    Etat_engin[Etat_engin["MAD"] = 2] = "MAD";
    Etat_engin[Etat_engin["ENATTENTE"] = 3] = "ENATTENTE";
    Etat_engin[Etat_engin["PANNE"] = 4] = "PANNE";
})(Etat_engin = exports.Etat_engin || (exports.Etat_engin = {}));
var Type_vidange;
(function (Type_vidange) {
    Type_vidange[Type_vidange["HEURE"] = 0] = "HEURE";
    Type_vidange[Type_vidange["KILOMETRAGE"] = 1] = "KILOMETRAGE";
})(Type_vidange = exports.Type_vidange || (exports.Type_vidange = {}));
