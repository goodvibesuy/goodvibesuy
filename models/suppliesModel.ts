import { Result, ResultWithData, ResultCode } from '../datatypes/result';
var masterDBController = require('../bd/masterConnectionsBD');
var clientDBController = require('../bd/clientConnectionsBD');

class SuppliesModel {
    constructor() {
    }


    supplies(dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (err) {
                con.release();
                console.error(err);
            } else {
                con.query('SELECT * FROM supply INNER JOIN supplyPrice ON id  = idSupply ORDER BY date DESC', function (
                    err: any,
                    result: any
                ) {
                    if (err) throw err;
                    callBack({ result: 1, message: 'OK', data: result });
                });
            }
        });
    };

    suppliesByProduct(idProduct: Number, dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (err) {
                con.release();
                console.error(err);
            } else {
                con.query(
                    'SELECT * FROM supply INNER JOIN product_supply ON id  = idSupply WHERE idProduct = ?',
                    [idProduct],
                    function (err: any, result: any) {
                        if (err) throw err;
                        callBack({ result: 1, message: 'OK', data: result });
                    }
                );
            }
        });
    };

    addSupply(name: string, idUnit: Number, amount: Number, path_image: string, dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (err) {
                con.release();
                console.error(err);
            } else {
                con.query('INSERT INTO supply  (name, unit, path_image) VALUES(?,?,?)', [name, idUnit, path_image], function (
                    err:any,
                    result:any
                ) {
                    if (err) {
                        // sea cual sea el tipo de error => siempre (debería) tengo que liberar la conexión
                        // sino el cliente web queda esperando
                        // con.release();
                        if (err.code === 'ER_DUP_ENTRY') {
                            callBack({ result: -1, message: 'Error: ER_DUP_ENTRY' });
                        } else {
                            callBack({ result: -1, message: 'Error: generic' });
                        }
                    } else {
                        var idSupply = result.insertId;

                        con.query(
                            'INSERT INTO supplyPrice  (date, amount, idSupply) VALUES(NOW(),?,?)',
                            [amount, idSupply],
                            function (err:any, result:any) {
                                // sea cual sea el tipo de error => siempre tengo que liberar la conexión
                                // sino el cliente web queda esperando
                                // con.release();
                                if (err) {
                                    if (err.code === 'ER_DUP_ENTRY') {
                                        callBack({ result: -1, message: 'Error: ER_DUP_ENTRY' });
                                    } else {
                                        callBack({ result: -1, message: 'Error: generic' });
                                    }
                                } else {
                                    callBack({ result: 1, message: 'OK' });
                                }
                            }
                        );
                    }
                });
            }
        });
    };

    updateSupply(id: Number, name: Number, idUnit: Number, amount: Number, path_image: string, dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (err) {
                con.release();
                console.error(err);
            } else {
                con.query('UPDATE supply  SET name = ?, unit = ?, path_image = ? WHERE id = ?', [name, idUnit, path_image, id],
                function (err:any, resultClient:any) {
                    if (err) {
                        // sea cual sea el tipo de error => siempre tengo que liberar la conexión
                        // sino el cliente web queda esperando
                        // con.release();
                        if (err.code === 'ER_DUP_ENTRY') {
                            callBack({ result: -1, message: 'Error: ER_DUP_ENTRY' });
                        } else {
                            callBack({ result: -1, message: 'Error: generic' });
                        }
                    } else {
                        con.query('INSERT INTO supplyPrice  (date, amount,idSupply) VALUES(NOW(),?,?)', [amount, id], function (
                            err:any,
                            result:any
                        ) {
                            // sea cual sea el tipo de error => siempre tengo que liberar la conexión
                            // sino el cliente web queda esperando
                            // con.release();
                            if (err) {
                                if (err.code === 'ER_DUP_ENTRY') {
                                    callBack({ result: -1, message: 'Error: ER_DUP_ENTRY' });
                                } else {
                                    callBack({ result: -1, message: 'Error: generic' });
                                }
                            } else {
                                callBack({ result: 1, message: 'OK' });
                            }
                        });
                    }
                });
            }
        });
    };

    deleteSupply(id:Number, dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (err) {
                con.release();
                console.error(err);
            } else {
                con.query('DELETE FROM supply WHERE id = ? ', [id], function (err:any, resultClient:any) {
                    // siempre (debería) tengo que liberar la conexión sino el cliente web queda esperando
                    // con.release();
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            callBack({ result: -1, message: 'Error: ER_DUP_ENTRY' });
                        } else if (err.code == 'ER_ROW_IS_REFERENCED_2') {
                            callBack({ result: -1, message: 'Error: ER_ROW_IS_REFERENCED_2' });
                        } else {
                            callBack({ result: -1, message: 'Error: generic' });
                        }
                    } else {
                        callBack({ result: 1, message: 'OK' });
                    }
                });
            }
        });        
    };

}

module.exports = new SuppliesModel();