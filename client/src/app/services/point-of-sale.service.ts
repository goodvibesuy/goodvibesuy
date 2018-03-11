import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PointOfSale } from '../shared/models/pointofsale.model';

@Injectable()
export class PointOfSaleService {
	private pointOfSaleURL: string = '/api/pointOfSail';
	constructor(private http: HttpClient) {}

	get(): Observable<any> {
		return this.http.get<PointOfSale[]>(this.pointOfSaleURL);
	}

	getFilteredByName(filterName: string): Observable<any> {
		return this.http.get<PointOfSale[]>(this.pointOfSaleURL + '/getFilteredByName/' + filterName);
	}

	getPointOfSale(idPointOfSale: Number): Observable<any> {
		return this.http.get<PointOfSale[]>(this.pointOfSaleURL + '/getPointOfSale/' + idPointOfSale);
	}

	addPointOfSale(name:string, address:string, tel:string, coords:google.maps.LatLng): Observable<any> {
		return this.http.post(this.pointOfSaleURL, { name, address, tel ,coords});
	}

	updatePointOfSale(idPointOfSale: Number, name: string, address: string, tel: string,coord:google.maps.LatLng): Observable<PointOfSale> {
		return this.http.put<PointOfSale>(this.pointOfSaleURL, { id: idPointOfSale, name, address, tel,coord });
	}

	deletePointOfSale(idPointOfSale: Number): Observable<any> {
		return this.http.delete(this.pointOfSaleURL + '/' + idPointOfSale);
	}
}
