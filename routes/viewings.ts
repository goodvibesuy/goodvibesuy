import { SuppliesController } from '../controllers/suppliesController';
import * as express from 'express';
import { ViewingsController } from '../controllers/viewingsController';

class Viewings {
    constructor() { }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let viewingsController: ViewingsController = new ViewingsController();


        router.get('/viewingsBetween/:sourceYear/:sourceMonth/:sourceDay/:lastYear/:lastMonth/:lastDay/:idPos/:idProduct', viewingsController.viewingsBetween);

        router.get('/viewingsByRoute/:idRoute', viewingsController.viewingsByRoute);

        router.get('/getRouteDelivery/:idRoute', viewingsController.getRouteDelivery);        

        router.get('/getViewingbyId/:idViewing', viewingsController.getViewingById);

        router.post('/', viewingsController.add);

        router.post('/countDeliveryProductsInViewings', viewingsController.countDeliveryProductsInViewings);        

        router.get('/wasVisited/:idRoute/:idPointOfSale', viewingsController.viewingByRouteAndPOS);

        router.get('/viewingProductTypes', viewingsController.viewingProductTypes);
        
        router.delete('/:id', viewingsController.delete);

        return router;
    }
}

module.exports = new Viewings();


