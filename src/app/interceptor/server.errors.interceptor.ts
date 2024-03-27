import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EMPTY, Observable, catchError, retry, tap } from "rxjs";
import { environment } from "../../environments/environment.development";
import { Inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    constructor(
        private _snackBar: MatSnackBar,
        private router: Router
    ) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(retry(environment.RETRY))
            .pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);
                    }
                }
            })).pipe(catchError((err) => {
                if (err.status === 400) {
                    //console.log(err);
                    this._snackBar.open(err.message, 'ERROR 400', { duration: 5000 });
                }
                else if (err.status === 404) {
                    this._snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
                }
                else if (err.status === 403 || err.status === 401) {
                    //console.log(err);
                    this._snackBar.open(err.error.message, 'ERROR 403', { duration: 5000 });
                    //sessionStorage.clear();
                    //this.router.navigate(['/login']);
                }
                else if (err.status === 500) {
                    this._snackBar.open(err.error.message, 'ERROR 500', { duration: 5000 });
                }
                else {
                    this._snackBar.open(err.error.message, 'ERROR', { duration: 5000 });
                }

                return EMPTY;
            }));
    }

}