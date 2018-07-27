import { Request, Response, NextFunction } from "express";

const https = require("https");
const promise = require("bluebird");
const options = {
    promiseLib: promise
};

const pgp = require("pg-promise")(options);
const conString = "postgres://appaccount:postgres@10.10.10.10:5432/justus";
const db = pgp(conString);

// Add Query functions here and define them in the module.exports at the end


// All GET requests first
// Get all julkaisut
function getJulkaisut(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu")
        .then(function(data: any) {
            res.status(200)
                .json({
                    data: data
    });
})
        .catch(function(err: any) {
        return next(err);
});
}

// Get a specific julkaisu by "id"
function getAjulkaisu(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu where id = ${id}", {
        id: req.params.id
    })
        .then(function(data: any) {
            res.status(200)
                .json({
                    data: data
                });
            })
                .catch(function(err: any) {
                return next(err);
        });
}

// Get all julkaisut that belong to a specific organisation
function getJulkaisuListaforOrg(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu where organisaatiotunnus = ${organisaatiotunnus}", {
        organisaatiotunnus: req.params.organisaatiotunnus
    })
        .then(function(data: any) {
            res.status(200)
                .json({
                    data: data
                });
            })
                .catch(function(err: any) {
                return next(err);
        });
}
// Get org tekija, just a test
function getOrgTekija(req: Request, res: Response, next: NextFunction) {
    db.any("select * from organisaatiotekija where id = ${id}", {
        id: req.params.id
    })
    .then(function(data: any) {
        res.status(200)
            .json({
                data: data
            });
        })
            .catch(function(err: any) {
            return next(err);
    });
}
function getJulkaisunLuokat(req: Request, res: Response, next: NextFunction) {
// TODO ADD CODE HERE
}
function getJulkaisunTilat(req: Request, res: Response, next: NextFunction) {
// TODO ADD CODE HERE
}
function getKielet(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE
    https.get("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/kieli/koodi?onlyValidKoodis=false", (resp: Response) => {
        let data = "";
        resp.on("data", (chunk: any) => {
            data += chunk;
        });
        resp.on("end", () => {
            res.send(JSON.parse(data));
        });
    })
    .on("error", (err: Error) => {
        console.log("Error: " + err.message);
    });
}
function getValtiot(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getTaideAlanTyyppiKategoria(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getTaiteenalat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getTieteenalat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getUser(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getTekijanRooli(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getAvainSanat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisuSarjat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getKonferenssinimet(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getKustantajat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJufo(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJufotISSN(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisutVIRTACF(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisuVirta(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisuCrossref(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}


// POST requests
// Post a julkaisu
function postJulkaisu(req: Request, res: Response, next: NextFunction) {
    db.none("INSERT INTO julkaisu DEFAULT VALUES")
    .then(function() {
        res.status(200)
        .json({
            message: "Insert successful"
        });
    })
    .catch(function(err: any) {
    return next(err);
});
}


// Post orgtekija, just a test
function postOrg(req: Request, res: Response, next: NextFunction) {
    db.none("INSERT INTO organisaatiotekija VALUES (1, 2, 'Victor', 'Tester', 'csc', 'Seniorez Developez')")
    .then(function() {
        res.status(200)
        .json({
            message: "Insert successful"
        });
    })
    .catch(function(err: any) {
    return next(err);
});
}

function postAdminImpersonate(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function postAdminAction(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}

// PUT requests
function putJulkaisu(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function putJulkaisuntila(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}





module.exports = {
    // GET requests
    getOrgTekija: getOrgTekija,
    getJulkaisut: getJulkaisut,
    getAjulkaisu: getAjulkaisu,
    getJulkaisuListaforOrg: getJulkaisuListaforOrg,
    getJulkaisunLuokat: getJulkaisunLuokat,
    getJulkaisunTilat: getJulkaisunTilat,
    getTekijanRooli: getTekijanRooli,
    getKielet: getKielet,
    getValtiot: getValtiot,
    getTaideAlanTyyppiKategoria: getTaideAlanTyyppiKategoria,
    getTaiteenalat: getTaiteenalat,
    getTieteenalat: getTieteenalat,
    getUser: getUser,
    getAvainSanat: getAvainSanat,
    getJulkaisuSarjat: getJulkaisuSarjat,
    getKonferenssinimet: getKonferenssinimet,
    getKustantajat: getKustantajat,
    getJufo: getJufo,
    getJufotISSN: getJufotISSN,
    getJulkaisutVIRTACF: getJulkaisutVIRTACF,
    getJulkaisuVirta: getJulkaisuVirta,
    getJulkaisuCrossref: getJulkaisuCrossref,
    // POST requests
    postJulkaisu: postJulkaisu,
    postOrg: postOrg,
    postAdminAction: postAdminAction,
    postAdminImpersonate: postAdminImpersonate,
    // PUT requests
    putJulkaisu: putJulkaisu,
    putJulkaisuntila: putJulkaisuntila,

};
