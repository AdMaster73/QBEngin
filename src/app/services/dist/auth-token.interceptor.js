"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthTokenHttpInterceptorProvider = exports.AuthTokenHttpInterceptor = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var AuthTokenHttpInterceptor = /** @class */ (function () {
    function AuthTokenHttpInterceptor(auth) {
        this.auth = auth;
    }
    AuthTokenHttpInterceptor.prototype.intercept = function (req, next) {
        return this.auth.idToken.pipe(operators_1.take(1), operators_1.switchMap(function (idToken) {
            var clone = req.clone();
            if (idToken) {
                clone = clone.clone({ headers: req.headers.set('Authorization', 'Bearer ' + idToken) });
            }
            return next.handle(clone);
        }));
    };
    AuthTokenHttpInterceptor = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], AuthTokenHttpInterceptor);
    return AuthTokenHttpInterceptor;
}());
exports.AuthTokenHttpInterceptor = AuthTokenHttpInterceptor;
exports.AuthTokenHttpInterceptorProvider = {
    provide: http_1.HTTP_INTERCEPTORS,
    useClass: AuthTokenHttpInterceptor,
    multi: true
};
