"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("../datatypes/result");
var mainModel_1 = require("./mainModel");
var masterDBController = require('../bd/masterConnectionsBD');
var TemplateRoutesModel = /** @class */ (function (_super) {
    __extends(TemplateRoutesModel, _super);
    function TemplateRoutesModel() {
        return _super.call(this) || this;
    }
    TemplateRoutesModel.prototype.getAll = function (dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT * FROM templateRoute", function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TemplateRoutesModel.prototype.add = function (travelName, dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("INSERT INTO templateRoute (name) VALUES (?)", [travelName], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TemplateRoutesModel.prototype.addPointOfSale = function (idTemplateRoute, idPointOfSale, dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT position AS last FROM templateRoute_pointofsale WHERE idTemplateRoute = ? order by position desc limit 1", [idTemplateRoute], function (err, result) {
                    if (err)
                        throw err;
                    var lastPointOfSale = result.length == 0 ? 0 : result[0].last;
                    con.query("INSERT INTO templateRoute_pointofsale (idTemplateRoute,idpointofsale,position) VALUES (?,?,?)", [idTemplateRoute, idPointOfSale, lastPointOfSale + 1], function (err, result) {
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
    TemplateRoutesModel.prototype.removePointOfSale = function (idRoute, idPointOfSale, dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT position FROM templateRoute_pointofsale WHERE idTemplateRoute = ? AND idpointofsale = ?", [idRoute, idPointOfSale], function (err, result) {
                    if (err)
                        throw err;
                    var positionPointOfSale = result[0].position;
                    con.query("DELETE FROM templateRoute_pointofsale WHERE idTemplateRoute = ? AND idpointofsale = ?", [idRoute, idPointOfSale], function (err, result) {
                        if (err)
                            throw err;
                        con.query("UPDATE templateRoute_pointofsale SET position = position -1 WHERE idTemplateRoute = ? AND  position > ?", [idRoute, positionPointOfSale], function (err, result) {
                            con.release();
                            callBack({ result: 1, message: "OK", data: result });
                        });
                    });
                });
            }
        });
    };
    TemplateRoutesModel.prototype.reorderPointOfSale = function (idRoute, idPointOfSale, position, newPosition, dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("UPDATE templateRoute_pointofsale SET position = ? WHERE idTemplateRoute = ? AND position = ?", [position, idRoute, newPosition], function (err, result) {
                    if (err)
                        throw err;
                    con.query("UPDATE templateRoute_pointofsale SET position = ? WHERE idTemplateRoute = ? AND idpointofsale = ?", [newPosition, idRoute, idPointOfSale], function (err, result) {
                        con.release();
                        callBack({ result: 1, message: "OK", data: result });
                    });
                });
            }
        });
    };
    TemplateRoutesModel.prototype.getPointsOfSales = function (idRoute, dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("SELECT * FROM templateRoute_pointofsale INNER JOIN pointofsale as POS ON POS.id = idpointofsale WHERE idTemplateRoute = ? ORDER BY position ASC", [idRoute], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TemplateRoutesModel.prototype.update = function (travelName, idRoute, dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("UPDATE templateRoute SET  name = ? WHERE id =?", [travelName, idRoute], function (err, result) {
                    con.release();
                    if (err)
                        throw err;
                    callBack({ result: 1, message: "OK", data: result });
                });
            }
        });
    };
    ;
    TemplateRoutesModel.prototype.delete = function (idRoute, dbName, callBack) {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err, con) {
            if (err) {
                con.release();
                console.error(err);
            }
            else {
                con.query("DELETE FROM templateRoute WHERE id = ?", [idRoute], function (err, result) {
                    con.release();
                    if (!!err) {
                        // TODO: log error -> common/errorHandling.ts
                        // errorHandler.log(err);
                        console.error(err);
                        var errorMessage = err.code;
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
    return TemplateRoutesModel;
}(mainModel_1.MainModel));
exports.TemplateRoutesModel = TemplateRoutesModel;
//# sourceMappingURL=templatesRouteModel.js.map