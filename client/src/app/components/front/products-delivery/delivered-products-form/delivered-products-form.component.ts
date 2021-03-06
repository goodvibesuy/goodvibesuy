// angular core
import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
// service
import { ViewingService } from '../../../../services/viewing.service';
// datatypes;
import { ViewingView } from '../../../../../../../datatypes/views/viewingView';
import { LineViewingView } from '../../../../../../../datatypes/views/lineViewingView';
import { AlertService } from '../../../../modules/alert/alert.service';
import { ResultCode } from '../../../../../../../datatypes/result';


@Component({
    selector: 'delivered-products-form', 
    templateUrl: './delivered-products-form.component.html'
})
export class DeliveredProductsFormComponent implements OnInit {
        
    @Input('viewingProductTypes') viewingProductTypes;
    @Input('products-to-send') productsToSend;
    @Input('id-route') idRoute: number;
    @Input('id-viewing') idViewing: number;

    public viewingVisited: ViewingView;

    constructor(
        private viewingService: ViewingService,
        private router: Router,
        private alertService: AlertService
    ) { } 

    ngOnInit(): void {
        this.viewingVisited = new ViewingView();

        this.viewingService.getViewing(this.idViewing).subscribe(
            response => {
                this.viewingVisited.setDate(response.data[0].date);
                let line: LineViewingView = new LineViewingView(response.data[0].date, null, 0);
                line.setProducts(response.data[0].products);
                line.setPointOfSale(response.data[0].pos);
                this.viewingVisited.addLine(line);                                  
            },
            error => {
                console.error(error);
                this.alertService.error('Error cargando datos del servidor.');
            }
        );
    }

    public eliminar(): void {
        if (confirm("¿Realmente desea eliminar la visita?")) {
            this.viewingService.delete(this.idViewing).subscribe(
                response => {
                    if (response.result == ResultCode.OK) {                    
                        const keepAfterRouteChange: boolean = true;
                        this.alertService.success('Visita eliminada correctamente.', keepAfterRouteChange);
                        this.router.navigateByUrl('/mapa/' + this.idRoute);
                    } else {
                        console.error(response.message);
                        this.alertService.error(response.message);
                    }
                },
                err => {
                    console.error(err);
                    this.alertService.error('Error eliminando el producto.');
                }
            );
        }
    }
}
