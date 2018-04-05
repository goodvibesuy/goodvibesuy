import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PointOfSale } from '../models/pointofsale.model';
import { ResultWithData, ResultCode } from '../../../../datatypes/result';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class PointOfSaleService {
    private pointOfSaleURL: string = '/api/pointOfSail';
    constructor(private http: HttpClient) { }

    get(): Observable<any> {
        return this.http.get<PointOfSale[]>(this.pointOfSaleURL);
    }

    getFilteredByName(filterName: string): Observable<any> {
        return this.http.get<PointOfSale[]>(this.pointOfSaleURL + '/getFilteredByName/' + filterName);
    }

    getPointOfSale(idPointOfSale: Number): Observable<ResultWithData<PointOfSale>> {
        return this.http.get<ResultWithData<PointOfSale>>(this.pointOfSaleURL + '/getPointOfSale/' + idPointOfSale);
    }

    addPointOfSale(pos: PointOfSale): Observable<any> {
        return this.http.post(this.pointOfSaleURL, pos);
    }

    updatePointOfSale(pos: PointOfSale): Observable<PointOfSale> {
        return this.http.put<PointOfSale>(this.pointOfSaleURL, pos);
    }

    deletePointOfSale(idPointOfSale: Number): Observable<any> {
        return this.http.delete(this.pointOfSaleURL + '/' + idPointOfSale);
    }
}