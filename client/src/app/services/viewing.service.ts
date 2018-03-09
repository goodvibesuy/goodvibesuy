import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class ViewingService {
    private viewingsURL: string = '/api/viewings';
    constructor(private http: HttpClient) { }

    addViewing(headers: HttpHeaders, idPointOfSale: Number, data: any): Observable<any> {
        return this.http.post(this.viewingsURL,
            { idPointOfSale:idPointOfSale, data:data },
            { headers: headers });
    }
}