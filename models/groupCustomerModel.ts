import { Result, ResultWithData, ResultCode } from '../datatypes/result';
import { Product } from '../datatypes/product';
import { MainModel } from './mainModel';
var masterDBController = require('../bd/masterConnectionsBD');

var mysql = require('mysql');

export class GroupPosModel extends MainModel{    
    constructor() {
        super();    
    }

    getAll(dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (err) {
                console.log(err);
                con.release();
                console.error(err);
            } else {
                con.query('SELECT * FROM groupCustomer ORDER BY name ASC', function (err: any, result: any[]) {
                    con.release();
                    if (!!err) {
                        console.log(err);
                        callBack({
                            result: ResultCode.Error,
                            message: 'Error'
                        });
                    } else {
                        callBack({
                            result: ResultCode.OK,
                            message: 'OK',
                            data: result
                        });
                    }
                });
            }
        });
    }
}