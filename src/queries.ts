import { Request, Response, NextFunction } from "express";
import { FILE } from "dns";
const schedule = require("node-schedule");
// https will be used for external API calls
const https = require("https");
const promise = require("bluebird");
const kp = require("./koodistopalvelu");
const oh = require("./objecthandlers");
const fs = require("fs");
// Options used for our pgp const
const options = {
    promiseLib: promise
};

const BASEURLFINTO = "https://api.finto.fi/rest/v1/yso/search?type=skos%3AConcept&unique=true&lang=";
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
    db.any("select julkaisu.*, organisaatiotekija.id AS orgid, organisaatiotekija.etunimet, organisaatiotekija.sukunimi, organisaatiotekija.orcid, organisaatiotekija.rooli, alayksikko.alayksikko, tieteenala.tieteenalakoodi, tieteenala.jnro, taiteenala.taiteenalakoodi, taiteenala.jnro, avainsana.avainsana AS avainsanat, taidealantyyppikategoria.tyyppikategoria AS taidealantyyppikategoria, lisatieto.lisatietotyyppi, lisatieto.lisatietoteksti from julkaisu, organisaatiotekija, alayksikko, tieteenala, taiteenala, avainsana, taidealantyyppikategoria, lisatieto where julkaisu.id = organisaatiotekija.julkaisuid AND organisaatiotekija.id = alayksikko.organisaatiotekijaid AND julkaisu.id = tieteenala.julkaisuid AND julkaisu.id= taiteenala.julkaisuid AND julkaisu.id = avainsana.julkaisuid AND julkaisu.id = taidealantyyppikategoria.julkaisuid AND julkaisu.id = lisatieto.julkaisuid")
        .then((data: any) => {
            res.status(200)
                .json({
                    julkaisut: oh.ObjectHandlerAllJulkaisut(data)
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

function getUser(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getAvainSanat(req: Request, res: Response, next: NextFunction) {
        if (req.query.lang === "FI" ) {
           const url: string = BASEURLFINTO + req.query.lang + "&query=" + req.query.q + "*";
           const secondurl: string = BASEURLFINTO + "EN" + "&query=" + req.query.q + "*";
           kp.HTTPGETshow(url, res, oh.ObjectHandlerAvainsanat, secondurl);
        }
        else {
        const apiurl: string = BASEURLFINTO + req.query.lang + "&query=" + req.query.q + "*";
        console.log("This is the apiurl: " + apiurl);
        console.log("HELLO THIS WORKS YESYESYS");
        kp.HTTPGETshow(apiurl, res, oh.ObjectHandlerAvainsanat);
    }
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

// Esitäyttö, figure out how the res object should look.
function getJulkaisuVirtaCrossrefEsitäyttö(req: Request, res: Response, next: NextFunction) {
    const apiurlCR = "https://api.crossref.org/works/" + req.query.id;
    const apiurlVirta = "https://virta-jtp.csc.fi/api/julkaisut/" + req.query.id;
    console.log("This is the req query lahde: " + req.query.lahde + " And this is the req query id: " + req.query.id);
    if (req.query.lahde === "virta") {
        kp.HTTPGETshow(apiurlVirta, res , oh.ObjectHandlerVirtaEsitäyttö);
    }
    else if (req.query.lahde === "crossref") {
        kp.HTTPGETshow(apiurlCR, res, oh.ObjectHandlerCrossrefEsitäyttö);
    }
    else {
        res.send("Wrong lahde parameter, try again");
    }
}

// POST requests
// Post a julkaisu to the database
// Catch the JSON body and parse it so that we can insert the values into postgres
function postJulkaisu(req: Request, res: Response, next: NextFunction) {
    db.task(() => {
        return db.one(
            "INSERT INTO julkaisu (organisaatiotunnus, julkaisutyyppi, julkaisuvuosi, julkaisunnimi, tekijat, julkaisuntekijoidenlukumaara, konferenssinvakiintunutnimi, emojulkaisunnimi, isbn, emojulkaisuntoimittajat, lehdenjulkaisusarjannimi, issn, volyymi, numero, sivut, artikkelinumero, kustantaja, julkaisunkustannuspaikka, julkaisunkieli, julkaisunkansainvalisyys, julkaisumaa, kansainvalinenyhteisjulkaisu, yhteisjulkaisuyrityksenkanssa, doitunniste, pysyvaverkkoosoite, julkaisurinnakkaistallennettu, avoinsaatavuus, rinnakkaistallennetunversionverkkoosoite, lisatieto, jufotunnus, jufoluokitus, julkaisuntila, username, modified)" + "values (${julkaisu.organisaatiotunnus}, ${julkaisu.julkaisutyyppi}, ${julkaisu.julkaisuvuosi}, ${julkaisu.julkaisunnimi}, ${julkaisu.tekijat}, ${julkaisu.julkaisuntekijoidenlukumaara}, ${julkaisu.konferenssinvakiintunutnimi}, ${julkaisu.emojulkaisunnimi}, ${julkaisu.isbn}, ${julkaisu.emojulkaisuntoimittajat}, ${julkaisu.lehdenjulkaisusarjannimi}, ${julkaisu.issn}, ${julkaisu.volyymi}, ${julkaisu.numero}, ${julkaisu.sivut}, ${julkaisu.artikkelinumero}, ${julkaisu.kustantaja}, ${julkaisu.julkaisunkustannuspaikka}, ${julkaisu.julkaisunkieli}, ${julkaisu.julkaisunkansainvalisyys}, ${julkaisu.julkaisumaa}, ${julkaisu.kansainvalinenyhteisjulkaisu}, ${julkaisu.yhteisjulkaisuyrityksenkanssa}, ${julkaisu.doitunniste}, ${julkaisu.pysyvaverkkoosoite}, ${julkaisu.julkaisurinnakkaistallennettu}, ${julkaisu.avoinsaatavuus}, ${julkaisu.rinnakkaistallennetunversionverkkoosoite}, ${julkaisu.lisatieto}, ${julkaisu.jufotunnus}, ${julkaisu.jufoluokitus}, ${julkaisu.julkaisuntila}, ${julkaisu.username}, ${julkaisu.modified}) RETURNING id", req.body)

    .then((julkaisuid: any) => {
        return db.one("INSERT INTO tieteenala (tieteenalakoodi, jnro, julkaisuid)" + "values ('joku koodi', 5 , " + JSON.parse(julkaisuid.id) + ") RETURNING julkaisuid", req.body.tieteenala);
    })
    .then((julkaisuid: any) => {
        return db.one("INSERT INTO taiteenala (julkaisuid, taiteenalakoodi, jnro)" + "values (" + JSON.parse(julkaisuid.id) + ", 'joku taiteenalakoodi', 6) RETURNING julkaisuid", req.body.taiteenala);
    })
    .then((julkaisuid: any) => {
        return db.one("INSERT INTO avainsana (julkaisuid, avainsana)" + "values (" + JSON.parse(julkaisuid.id) + ", 'joku avainsana') RETURNING julkaisuid", req.body.avainsanat);
    })
    .then((julkaisuid: any) => {
        return db.one("INSERT INTO taidealantyyppikategoria (julkaisuid, tyyppikategoria)" + "values (" + JSON.parse(julkaisuid.id) + ", 7) RETURNING julkaisuid", req.body.taidealantyyppikategoria);
    })
    .then((julkaisuid: any) => {
        return db.one("INSERT INTO lisatieto (julkaisuid, lisatietotyyppi, lisatietoteksti)" + "values (" + JSON.parse(julkaisuid.id) + ", 'joku lisatietotyyppi, 'joku lisatietoteksti') RETURNING julkaisuid", req.body.lisatieto);
    })
    .then((julkaisuid: any) => {
        return db.one("INSERT INTO organisaatiotekija (julkaisuid, etunimet, sukunimi, orcid, rooli)" + "values (" + JSON.parse(julkaisuid.id) + ", 'asd', 'asd', 'asd', 'asd') RETURNING id", req.body.organisaatiotekija);
    })
    .then((organisaatiotekijaid: any) => {
        return db.one("INSERT INTO alayksikko (organisaatiotekijaid, alayksikko)" + "values (" + JSON.parse(organisaatiotekijaid.id) + ", 'joku alayksikko') RETURNING organisaatiotekijaid", req.body.alayksikko);
    })
    .then((obj: any) =>  {
        res.status(200)
        .json({
            message: obj,
            // julkaisu: Julkaisu,
            // organisaatiotekija: organisaatiotekija,
            // tieteenala: tieteenala,
            // taiteenala: taiteenala,
            // avainsanat: avainsanat,
            // taidealantyyppikategoria: taidealantyyppikategoria,
            // lisatieto: lisatieto
        });
    })
    .catch(function(err: any) {
    return next(err);
     });
});
}


// GET ORGANISAATIOLISTAUS
function getOrganisaatioListaus(req: Request, res: Response, next: NextFunction) {
    fs.readFile("/vagrant/src/jsonFiles/organisaatiolistaus.json", "utf8", function read(err: any, data: any) {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
    });
}

function getUserLaurea(req: Request, res: Response, next: NextFunction) {
    fs.readFile("/vagrant/src/jsonFiles/laurea.json", "utf8", function read(err: any, data: any) {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
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
    getJulkaisuVirtaCrossrefEsitäyttö: getJulkaisuVirtaCrossrefEsitäyttö,
    getOrganisaatioListaus: getOrganisaatioListaus,
    getUserLaurea: getUserLaurea,
    // POST requests
    postJulkaisu: postJulkaisu,
    postOrg: postOrg,
    postAdminAction: postAdminAction,
    postAdminImpersonate: postAdminImpersonate,
    // PUT requests
    putJulkaisu: putJulkaisu,
    putJulkaisuntila: putJulkaisuntila,

};