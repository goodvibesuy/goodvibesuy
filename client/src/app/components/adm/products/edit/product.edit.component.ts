import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
// service
import { ProductsService } from '../../../../services/products.service';
import { ImagesService } from '../../../../services/images.service';
// models
import { Product } from '../../../../shared/models/product.model';
import { GVFile } from '../../../../shared/models/gvfile.model';
import { GVHttpResult, ResultCode } from '../../../../shared/httpResult';

import { GeneralComponent } from '../../../general/general.component';

@Component({
	templateUrl: './product.edit.component.html',
	styleUrls: ['./product.edit.component.css']
})
export class ProductEditComponent extends GeneralComponent implements OnInit, OnDestroy {
	paramsSub: any;

	private product: Product;
	private imageFile: GVFile;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private domSanitizer: DomSanitizer,
		private productsService: ProductsService,
		private imagesService: ImagesService
	) {
		super();
	}

	ngOnInit() {
		this.setHeaderValues();
		this.paramsSub = this.activatedRoute.params.subscribe(
			params => {
				this.productsService.get(this.generateHeader()).subscribe(res => {
					if (res.result == ResultCode.Error) {
						// TODO: handle error
					} else {
						this.product = res.data.find(s => s.id == params['id']);
					}
				});
			},
			// TODO: handle error
			error => {}
		);
	}

	ngOnDestroy() {
		this.paramsSub.unsubscribe();
	}

	actualizar() {
		const category: string = 'productos';

		var promise = this.productsService.update(this.product);

		promise.subscribe(data => {
			if (!!this.imageFile) {
				this.imagesService
					.sendImage(category, this.product.path_image, this.imageFile.size, this.imageFile.data)
					.subscribe(
						res => {
							this.router.navigateByUrl('/productos');
						},
						error => {
							console.error(error);
						}
					);
			} else {
				this.router.navigateByUrl('/productos');
			}
		});
	}

	getImage() {
		return this.imageFile
			? this.domSanitizer.bypassSecurityTrustUrl(
					'data:image/' + this.imageFile.type + ';base64, ' + this.imageFile.data
			  )
			: 'images/productos/' + this.imagesService.getSmallImage(this.product.path_image);
	}

	handleSelected(file: GVFile): void {
		if (!!file) {
			this.imageFile = file;
			this.product.path_image = this.product.id + '_' + this.imageFile.name;
		}
	}
}
