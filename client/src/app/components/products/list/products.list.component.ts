import { Component, OnInit, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { Product } from '../../../shared/models/product.model';
import { ImagesService } from '../../../services/images.service';
import { ProductsService } from '../../../services/products.service';
import { GeneralComponent } from '../../general/general.component';

@Component({
	templateUrl: './products.list.component.html',
	styleUrls: ['./products.list.component.css']
})
export class ProductsListComponent extends GeneralComponent implements OnInit {
	private products: Product[];

	constructor(private productsService: ProductsService, private imagesService: ImagesService) {
        super();
    }

	ngOnInit() {
        this.setHeaderValues();
		this.loadProducts();
	}

	delete(id: number): void {
		this.productsService.delete(id).subscribe(data => this.loadProducts());
	}

	loadProducts(): void {        
		this.productsService.get(this.generateHeader()).subscribe(
            
            response => {
                this.products = response.data
            }, 
            error => {}
        );
	}

	getSmallImage(path: string): string {
		return this.imagesService.getSmallImage(path);
	}
}
