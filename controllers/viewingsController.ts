var masterDBController = require('../bd/masterConnectionsBD');
var acl = require('../motionLibJS/serverSide/acl/motionACL');

import {MainController} from './mainController';
import {ViewingsModel} from '../models/viewingsModel';

class ViewingsController extends MainController{
    private viewingsModel:ViewingsModel;
    constructor(){        
        super();
        this.viewingsModel = new ViewingsModel();
    }

    public add = (req:any,res:any): void => { 
        this.verifyAccess(req,res,"viewing",
            (dbName:string) =>{
                var data = req.body.data;
                this.viewingsModel.addVisit(req.headers['user'],req.body.idPointOfSale, data, req.body.annotation,dbName,function (result:any) {
                    res.send(result);
                });
            }             
        )
    }
}

module.exports = new ViewingsController();