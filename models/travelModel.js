"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("../datatypes/result");
var masterDBController = require('../bd/masterConnectionsBD');
var clientDBController = require('../bd/clientConnectionsBD');
var TravelModel = /** @class */ (function () {
    function TravelModel() {
        this.removeUser = function (idRoute, idUser, dbName, callBack) {
            var pool = clientDBController.getUserConnection(dbName);
            pool.getConnection(function (err, con) {
                if (err) {
                    con.release();
                    console.error(err);
                }
                else {
                    con.query("DELETE FROM route_user WHERE idroute = ? AND iduser = ? ", [idRoute, idUser], function (err, result) {
                        con.release();
                        if (err)
                            throw err;
                        callBack({ result: 1, message: "OK", data: result });
                    });
                }
            });
        };
    }
    TravelModel.prototype.getAll = function (dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT * FROM route", function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TravelModel.prototype.add = function (travelName, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("INSERT INTO route (name) VALUES (?)", [travelName], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TravelModel.prototype.addPointOfSale = function (idRoute, idPointOfSale, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT position AS last FROM route_pointofsale WHERE idroute = ? order by position desc limit 1", [idRoute], function (err, result) {
                    if (err)
                        throw err;
                    var lastPointOfSale = result.length == 0 ? 0 : result[0].last;
                    con.query("INSERT INTO route_pointofsale (idroute,idpointofsale,position) VALUES (?,?,?)", [idRoute, idPointOfSale, lastPointOfSale + 1], function (err, result) {
                        con.release();
                        if (err)
                            throw err;
                        callBack({ result: 1, message: "OK", data: result });
                    });
                });
            }
        });
    };
    ;
    TravelModel.prototype.addUser = function (idRoute, idUser, date, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("INSERT INTO route_user (idroute,iduser,date) VALUES (?,?,?)", [idRoute, idUser, date.year + "-" + date.month + "-" + date.day], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TravelModel.prototype.removePointOfSale = function (idRoute, idPointOfSale, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT position FROM route_pointofsale WHERE idroute = ? AND idpointofsale = ?", [idRoute, idPointOfSale], function (err, result) {
                    if (err)
                        throw err;
                    var positionPointOfSale = result[0].position;
                    con.query("DELETE FROM route_pointofsale WHERE idroute = ? AND idpointofsale = ?", [idRoute, idPointOfSale], function (err, result) {
                        if (err)
                            throw err;
                        con.query("UPDATE route_pointofsale SET position = position -1 WHERE idroute = ? AND  position > ?", [idRoute, positionPointOfSale], function (err, result) {
                            con.release();
                            callBack({ result: 1, message: "OK", data: result });
                        });
                    });
                });
            }
        });
    };
    TravelModel.prototype.reorderPointOfSale = function (idRoute, idPointOfSale, position, newPosition, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("UPDATE route_pointofsale SET position = ? WHERE idroute = ? AND position = ?", [position, idRoute, newPosition], function (err, result) {
                    if (err)
                        throw err;
                    con.query("UPDATE route_pointofsale SET position = ? WHERE idroute = ? AND idpointofsale = ?", [newPosition, idRoute, idPointOfSale], function (err, result) {
                        con.release();
                        callBack({ result: 1, message: "OK", data: result });
                    });
                });
            }
        });
    };
    TravelModel.prototype.getPointsOfSales = function (idRoute, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT * FROM route_pointofsale INNER JOIN pointofsale as POS ON POS.id = idpointofsale WHERE idroute = ? ORDER BY position ASC", [idRoute], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TravelModel.prototype.getUers = function (idRoute, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT * FROM route_user INNER JOIN users as u ON u.id = idUser WHERE idroute = ?", [idRoute], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    TravelModel.prototype.update = function (travelName, idRoute, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("UPDATE route SET  name = ? WHERE idroute =?", [travelName, idRoute], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TravelModel.prototype.delete = function (idRoute, dbName, callBack) {
        var pool = clientDBController.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("DELETE FROM route WHERE idRoute = ?", [idRoute], function (err, result) {
                    con.release();
                    if (!!err) {
                        // TODO: log error -> common/errorHandling.ts
                        // errorHandler.log(err);
                        console.error(err);
                        var errorMessage = "";
                        if (err.code === "ER_ROW_IS_REFERENCED_2") {
                            errorMessage = "No se puede borrar el registro, porque es utilizado en otra parte del sistema";
                        }
                        callBack({
                            result: result_1.ResultCode.Error,
                            message: errorMessage
                        });
                    }
                    else {
                        callBack({
                            result: result_1.ResultCode.OK,
                            message: 'OK'
                        });
                    }
                    //if (err) throw err;
                });
            }
        });
    };
    ;
    return TravelModel;
}());
module.exports = new TravelModel();
//# sourceMappingURL=travelModel.js.map