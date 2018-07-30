import { Request, Response, NextFunction } from "express";
const schedule = require("node-schedule");
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
const conString = process.env.PG_URL;
// const db will be used for all queries etc. db.any, db.none and so on
const db = pgp(conString);

// Redis client
const redis = require("redis");
const client = redis.createClient();

// Check that redis is connected and log it to the console ((USE THIS FUNCTION LATER WHEN NEEDED, THIS IS JUST FOR SHOW))
// client.on("error", function() {
//     console.log("Error when connecting to redis");
//   });
//   client.on("connect", function() {
//     console.log("Redis is connected at 6379");
//   });
const redisScheduler = schedule.scheduleJob("30 * * * * *", function(res: Response, req: Request, next: NextFunction) {
    UpdateKoodistopalveluRedis(res, req, next);
});
function UpdateKoodistopalveluRedis(res: Response, req: Request, next: NextFunction) {
    client.on("connect", () => console.log("Connected to redis"),
    setKielet(res),
    setJulkaisunTilat(req, res, next),
    setTaideAlanTyyppiKategoria(req, res, next),
    setTaiteenalat(req, res, next),
    setTieteenalat(req, res, next),
    setTekijanRooli(req, res, next),
    setAlaYksikot(req, res, next),
    setValtiot(req, res, next),
    TestFunction());
}

function TestFunction() {
    console.log("Testing scheduler");
}
// http.get function to use for External API calls to reduce clutter in local API functions
function HTTPGET (URL: String, res: Response, redisInfo: String ) {
    https.get(URL, (resp: Response) => {
        let data = "";
        resp.on("data", (chunk: any) => {
            data += chunk;
        });
        resp.on("end", () => {
            // res.send(JSON.parse(data));
            client.set(redisInfo, data);
            client.get(redisInfo, function(err: Error, reply: any) {
                console.log(reply.toString());
            });
        });
    })
    .on("error", (err: Error) => {
        console.log("Error: " + err.message);
    });
}

// Add Query functions here and define them in the module.exports at the end

// Set values into Redis from koodistopalvelu

function setJulkaisunTilat(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisuntila/koodi?onlyValidKoodis=false", res, "getJulkaisunTilat");
}
function setKielet(res: Response) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/kieli/koodi?onlyValidKoodis=false", res, "getKielet");
}
function setValtiot(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/maatjavaltiot2/koodi?onlyValidKoodis=false", res, "getValtiot");
}
function setTaideAlanTyyppiKategoria(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/taidealantyyppikategoria/koodi?onlyValidKoodis=false", res, "getTaideAlanTyyppiKategoria");
}
function setTaiteenalat(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/taiteenala/koodi?onlyValidKoodis=false", res, "getTaiteenalat");
}
function setTieteenalat(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/tieteenala/koodi?onlyValidKoodis=false", res, "getTieteenalat");
}
function setTekijanRooli(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisuntekijanrooli/koodi?onlyValidKoodis=false", res, "getTekijanRooli");
}
function setAlaYksikot(req: Request, res: Response, next: NextFunction) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/alayksikkokoodi/koodi?onlyValidKoodis=false", res, "getAlaYksikot");
}
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
function getJulkaisunTilat(req: Request, res: Response, next: NextFunction) {
    client.on("connect"), () => console.log("Connected to redis");
    client.get("getJulkaisunTilat", function(err: Error, reply: any) {
        res.status(200)
            .json({
                data: reply
            });
    });
}
function getTekijanRooli(req: Request, res: Response, next: NextFunction) {
    client.on("connect"), () => console.log("Connected to redis");
    client.get("getJulkaisunTilat");
    client.quit();
}
function getKielet(req: Request, res: Response, next: NextFunction) {
    client.on("connect"), () => console.log("Connected to redis");
    client.get("getJulkaisunTilat");
    client.quit();
}
function getValtiot(req: Request, res: Response, next: NextFunction) {
    client.on("connect"), () => console.log("Connected to redis");
    client.get("getJulkaisunTilat");
    client.quit();
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
function getJulkaisuCrossref(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisunLuokat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getUser(req: Request, res: Response, next: NextFunction) {
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
function getAlaYksikot(req: Request, res: Response, next: NextFunction) {
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
