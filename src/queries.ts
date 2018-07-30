import { Request, Response, NextFunction } from "express";
// https will be used for external API calls
const https = require("https");
const promise = require("bluebird");
// Options used for our pgp const
const options = {
    promiseLib: promise
};

// Initializing postgres connection by using pg-promise
const pgp = require("pg-promise")(options);
// Connection string for the database, move this to a ENV.variable later
const conString = "postgres://appaccount:postgres@10.10.10.10:5432/justus";
// const db will be used for all queries etc. db.any, db.none and so on
const db = pgp(conString);

// http.get function to use for External API calls to reduce clutter in local API functions
function HTTPGET (URL: String, res: Response ) {
    https.get(URL, (resp: Response) => {
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
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisuntila/koodi?onlyValidKoodis=false", res);
}
// GET kielet from Koodistopalvelu
function getKielet(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/kieli/koodi?onlyValidKoodis=false", res);

}
// GET valtiot from koodistopalvelu
function getValtiot(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/maatjavaltiot2/koodi?onlyValidKoodis=false", res);

}
// GET taidealantyyppikategoriat from koodistopalvelu
function getTaideAlanTyyppiKategoria(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/taidealantyyppikategoria/koodi?onlyValidKoodis=false", res);
}
// GET taiteenalat from koodistopalvelu
function getTaiteenalat(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/taiteenala/koodi?onlyValidKoodis=false", res);
}
// GET tieteenalat from koodistopalvelu
function getTieteenalat(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/tieteenala/koodi?onlyValidKoodis=false", res);
}
function getUser(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
// GET tekijanrooli from koodistopalvelu
function getTekijanRooli(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisuntekijanrooli/koodi?onlyValidKoodis=false", res);
}
function getAvainSanat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
// GET alayksikot from koodistopalvelu
function getAlaYksikot(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/alayksikkokoodi/koodi?onlyValidKoodis=false", res);
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
// Post a julkaisu to the database
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
    getAlaYksikot: getAlaYksikot,
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
