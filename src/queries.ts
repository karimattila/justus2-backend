import { Request, Response, NextFunction } from "express";

const promise = require("bluebird");
const options = {
    promiseLib: promise
};

const pgp = require("pg-promise")(options);
const conString = "postgres://appaccount:postgres@10.10.10.10:5432/justus";
const db = pgp(conString);



// Add Query functions here and define them in the module.exports at the end


function getJulkaisut(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu")
        .then(function(data: any) {
            res.status(200)
                .json({
                    status: "success",
                    data: data,
                    message: "Retrieved ALL julkaisun"
    });
})
        .catch(function(err: any) {
        return next(err);
});
}



module.exports = {
    // getTest: getTest,
    // postTest: postTest,
    getJulkaisut: getJulkaisut,



};
