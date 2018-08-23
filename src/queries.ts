import { Request, Response, NextFunction } from "express";
const schedule = require("node-schedule");
// https will be used for external API calls
const https = require("https");
const promise = require("bluebird");
const kp = require("./koodistopalvelu");
const oh = require("./objecthandlers");
// Options used for our pgp const
const options = {
    promiseLib: promise
};

const BASEURLFINTO = "https://api.finto.fi/rest/v1/yso/search?type=skos%3AConcept&unique=true&lang=FI&query=";
const BASEURLJUFO =   "https://jufo-rest.csc.fi/v1.0/etsi.php?tyyppi=";

// Initializing postgres connection by using pg-promise
const pgp = require("pg-promise")(options);
// Connection string for the database, move this to a ENV.variable later
const conString = process.env.PG_URL;
// const db will be used for all queries etc. db.any, db.none and so on
const db = pgp(conString);

// Redis client
const redis = require("redis");
const client = redis.createClient();

// Scheduler for updating Koodistopalvelu data inside redis
// Each star represents a different value, beginning from second and ending in day
// So if we want to update it once a day at midnight we would use ("* 0 0 * * *")
const getRedis = (rediskey: string, success: any, error: any) => {
    client.get(rediskey, function (err: Error, reply: any) {
        if (!err) {
            success(reply);
        }
        else {
            error(err);
        }
    });
};

// Add Query functions here and define them in the module.exports at the end
// All GET requests first
// Get all julkaisut
function getJulkaisut(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu")
        .then((data: any) => {
            res.status(200)
                .json({
                    data: data
    });
})
        .catch((err: any) => {
        return next(err);
});
}

// Get a specific julkaisu by "id"
function getAjulkaisu(req: Request, res: Response, next: NextFunction) {
    kp.HTTPGETshow();
    db.any("select * from julkaisu where id = ${id}", {
        id: req.params.id
    })
        .then((data: any) => {
            res.status(200)
                .json({
                    data: data
                });
            })
                .catch((err: any) => {
                return next(err);
        });
}

// Get all julkaisut that belong to a specific organisation
function getJulkaisuListaforOrg(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu where organisaatiotunnus = ${organisaatiotunnus}", {
        organisaatiotunnus: req.params.organisaatiotunnus
    })
        .then((data: any) => {
            res.status(200)
                .json({
                    data: data
                });
            })
                .catch((err: any) => {
                return next(err);
        });
}
// Get org tekija, just a test
function getOrgTekija(req: Request, res: Response, next: NextFunction) {
    db.any("select * from organisaatiotekija where id = ${id}", {
        id : req.params.id
    //     test: {
    //     id: req.params.id,
    //     arvo: req.body.arvo ? req.body.arvo = "",
    // }
    })
    .then((data: any) => {
        res.status(200)
            .json({
                data: data
            });
        })
            .catch((err: any) => {
            return next(err);
    });
}

// KOODISTOPALVELU GETS

function getJulkaisunTilat(req: Request, res: Response, next: NextFunction) {
    getRedis("getJulkaisunTilat", function success(reply: any) {
        res.status(200).json(
            JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getTekijanRooli(req: Request, res: Response, next: NextFunction) {
    getRedis("getTekijanRooli", function success(reply: any) {
        res.status(200).json(
            JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getKielet(req: Request, res: Response, next: NextFunction) {
    getRedis("getKielet", function success(reply: any) {
        res.status(200).json(
            JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getValtiot(req: Request, res: Response, next: NextFunction) {
        getRedis("getValtiot", function success(reply: any) {
            res.status(200).json(
                JSON.parse(reply)
            );
    }, function error(err: Error) {
        console.log("Something went wrong");
    });
}
function getTaideAlanTyyppiKategoria(req: Request, res: Response, next: NextFunction) {
    getRedis("getTaideAlanTyyppiKategoria", function success(reply: any) {
        res.status(200).json(
            JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getTaiteenalat(req: Request, res: Response, next: NextFunction) {
    getRedis("getTaiteenalat", function success(reply: any) {
        res.status(200).json(
            JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getTieteenalat(req: Request, res: Response, next: NextFunction) {
    getRedis("getTieteenalat", function success(reply: any) {
        res.status(200).json(
           JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getJulkaisunLuokat(req: Request, res: Response, next: NextFunction) {
    getRedis("getJulkaisunLuokat", function success(reply: any) {
        res.status(200).json(
           JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}

// NOT SURE IF NEEDED

function getAlaYksikot(req: Request, res: Response, next: NextFunction) {
    getRedis("getAlayksikot", function success(reply: any) {
        res.status(200).json(
           JSON.parse(reply)
        );
}, function error(err: Error) {
    console.log("Something went wrong");
});
}

function getJulkaisuCrossref(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getUser(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getAvainSanat(req: Request, res: Response, next: NextFunction) {
        const apiurl: string = BASEURLFINTO + req.query.q + "*";
        console.log("This is the apiurl: " + apiurl);
        kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerAvainsanat);
}
function getJulkaisuSarjat(req: Request, res: Response, next: NextFunction) {
        const apiurl: string = BASEURLJUFO + "1&nimi=" + req.query.q;
        console.log("This is the apiurl: " + apiurl);

        // The jufo rest api is kinda weird, if the query word is <5 or over 50
        // it returns nothing, which breaks the code, hence the odd looking error handling

        if ((req.query.q).length >= 5 && (req.query.q).length <= 50) {
        kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerJulkaisusarjat);
        }
        else {
            res.send("");
        }
}
function getKonferenssinimet(req: Request, res: Response, next: NextFunction) {
        const apiurl: string = BASEURLJUFO + "3&nimi=" + req.query.q;
        console.log("This is the apiurl: " + apiurl);

        // The jufo rest api is kinda weird, if the query word is <5 or over 50
        // it returns nothing, which breaks the code, hence the odd looking error handling

        if ((req.query.q).length >= 5 && (req.query.q).length <= 50) {
        kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerKonferenssinnimet);
        }
        else {
            res.send("");
        }
}
function getKustantajat(req: Request, res: Response, next: NextFunction) {
        const apiurl: string = BASEURLJUFO + "2&nimi=" + req.query.q;
        console.log("This is the apiurl: " + apiurl);

        // The jufo rest api is kinda weird, if the query word is <5 or over 50
        // it returns nothing, which breaks the code, hence the odd looking error handling

        if ((req.query.q).length >= 5 && (req.query.q).length <= 50) {
        kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerKustantajat);
        }
        else {
            res.send("");
        }
}
function getJufo(req: Request, res: Response, next: NextFunction) {
        const apiurl: string = "https://jufo-rest.csc.fi/v1.0/kanava/" + req.params.id;
        console.log("This is the apiurl: " + apiurl);

        // The jufo rest api is kinda weird, if the query word is <5 or over 50
        // it returns nothing, which breaks the code, hence the odd looking error handling

        if ((req.params.id).length > 0 && (req.params.id).length <= 9) {
        kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerJufoID);
        }
        else {
            res.send("");
        }
}
function getJufotISSN(req: Request, res: Response, next: NextFunction) {
        const apiurl: string = "https://jufo-rest.csc.fi/v1.0/etsi.php?issn=" + req.query.issn;
        console.log("This is the apiurl: " + apiurl);

        // The jufo rest api is kinda weird, if the query word is <5 or over 50
        // it returns nothing, which breaks the code, hence the odd looking error handling

        if ((req.query.issn).length >= 5 && (req.query.issn).length <= 10) {
        kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerJufoISSN);
        }
        else {
            res.send("");
        }
}
function getJulkaisutVIRTACR(req: Request, res: Response, next: NextFunction) {
    const apiurl: string = "https://api.crossref.org/works?sort=published&order=desc&rows=50&query.title=" + req.query.q;
    console.log("This is the apiurl: " + apiurl);

    // The jufo rest api is kinda weird, if the query word is <5 or over 50
    // it returns nothing, which breaks the code, hence the odd looking error handling
    kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerJulkaisutVIRTACR);
}
function getJulkaisuVirta(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}


// POST requests
// Post a julkaisu to the database
// Catch the JSON body and parse it so that we can insert the values into postgres
function postJulkaisu(req: Request, res: Response, next: NextFunction) {
    const organisaatiotekija = req.body.organisaatiotekija.map((e: any) => {
        return {
        // ei ole tietoa käytetäänkö tätä ID:tä POST: reqissä
        // id: e.id,
        etunimet: e.etunimet,
        sukunimi: e.sukunimi,
        orcid: e.orcid,
        rooli: e.rooli,
        alayksikko: e.alayksikko
        };
    });
    const taidealantyyppikategoria = req.body.taidealantyyppikategoria.map((e: any) =>  e);
    const avainsanat = req.body.avainsanat.map((e: any) =>  e);
    const taiteenala = req.body.taiteenala.map((e: any) =>  e);
    const tieteenala = req.body.tieteenala.map((e: any) => {
        return {
        tieteenalakoodi: e.tieteenalakoodi,
        jnro: e.jnro,
        };
    });
    const lisatieto = {
        julkaisuvuodenlisatieto: req.body.lisatieto.julkaisuvuodenlisatieto,
        tapahtuma: req.body.lisatieto.tapahtuma,
        julkistamispaikkakunta: req.body.lisatieto.julkistamispaikkakunta,
        muutunniste: req.body.lisatieto.muutunniste,
    };
    const Julkaisu = {
        organisaatiotunnus: req.body.julkaisu.organisaatiotunnus,
        julkaisutyyppi: req.body.julkaisu.julkaisutyyppi,
        julkaisuvuosi: req.body.julkaisu.julkaisuvuosi,
        julkaisunnimi: req.body.julkaisu.julkaisunnimi,
        tekijat: req.body.julkaisu.tekijat,
        julkaisuntekijoidenlukumaara: req.body.julkaisu.julkaisuntekijoidenlukumaara,
        konferenssinvakiintunutnimi: req.body.julkaisu.konferenssinvakiintunutnimi,
        emojulkaisunnimi: req.body.julkaisu.emojulkaisunnimi,
        isbn: req.body.julkaisu.isbn,
        emojulkaisuntoimittajat: req.body.julkaisu.emojulkaisuntoimittajat,
        lehdenjulkaisusarjannimi: req.body.julkaisu.lehdenjulkaisusarjannimi,
        issn: req.body.julkaisu.issn,
        volyymi: req.body.julkaisu.volyymi,
        numero: req.body.julkaisu.numero,
        sivut: req.body.julkaisu.sivut,
        artikkelinumero: req.body.julkaisu.artikkelinumero,
        kustantaja: req.body.julkaisu.kustantaja,
        julkaisunkustannuspaikka: req.body.julkaisu.julkaisunkustannuspaikka,
        julkaisunkieli: req.body.julkaisu.julkaisunkieli,
        julkaisunkansainvalisyys: req.body.julkaisu.julkaisunkansainvalisyys,
        julkaisumaa: req.body.julkaisu.julkaisumaa,
        kansainvalinenyhteisjulkaisu: req.body.julkaisu.kansainvalinenyhteisjulkaisu,
        yhteisjulkaisuyrityksenkanssa: req.body.julkaisu.yhteisjulkaisuyrityksenkanssa,
        doitunniste: req.body.julkaisu.doitunniste,
        pysyvaverkkoosoite: req.body.julkaisu.pysyvaverkkoosoite,
        julkaisurinnakkaistallennettu: req.body.julkaisu.avoinsaatavuus,
        avoinsaatavuus: req.body.julkaisu.julkaisurinnakkaistallennettu,
        rinnakkaistallennetunversionverkkoosoite: req.body.julkaisu.rinnakkaistallennetunversionverkkoosoite,
        lisatieto: req.body.julkaisu.lisatieto,
        jufotunnus: req.body.julkaisu.jufotunnus,
        jufoluokitus: req.body.julkaisu.jufoluokitus,
        julkaisuntila: req.body.julkaisu.julkaisuntila,
        username: req.body.julkaisu.username,
        modified: req.body.julkaisu.modified,
    };
    db.none("INSERT INTO julkaisu DEFAULT VALUES")
    .then(function() {
        res.status(200)
        .json({
            julkaisu: Julkaisu,
            organisaatiotekija: organisaatiotekija,
            tieteenala: tieteenala,
            taiteenala: taiteenala,
            avainsanat: avainsanat,
            taidealantyyppikategoria: taidealantyyppikategoria,
            lisatieto: lisatieto
        });
    })
    .catch(function(err: any) {
    return next(err);
});
}


// Post orgtekija, just a test
function postOrg(req: Request, res: Response, next: NextFunction) {
    db.none("INSERT INTO organisaatiotekija VALUES (2, 5, 'Victor', 'Tester', 'csc', 'Seniorez Developez')")
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
    getJulkaisutVIRTACR: getJulkaisutVIRTACR,
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