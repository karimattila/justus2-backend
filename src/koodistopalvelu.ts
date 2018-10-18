import { Request, Response, NextFunction, json } from "express";
import { resolve } from "path";
const schedule = require("node-schedule");
const https = require("https");

// Redis client
const redis = require("redis");
const client = redis.createClient();

// Prefix for objecthandler import
const OH = require("./objecthandlers");

// REMEMBER THIS
// (node:1239) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connect listeners added. Use emitter.setMaxListeners() to increase limit

// Scheduler for updating Koodistopalvelu data inside redis
// Each star represents a different value, beginning from second and ending in day
// So if we want to update it once a day at midnight we would use ("* 0 0 * * *")
schedule.scheduleJob("30 * * * * *", function(res: Response) {
    UpdateKoodistopalveluRedis(res);
});
schedule.scheduleJob("45 * * * * *", function(res: Response) {
    UpdateOrgListaus(res);
});

function UpdateOrgListaus(res: Response) {
    setOrgListaus(res);
}



function UpdateKoodistopalveluRedis(res: Response) {
    client.on("connect", () =>  console.log("Connected to redis"),
    setAlaYksikot(res),
    setKielet(res),
    setJulkaisunTilat(res),
    setTaideAlanTyyppiKategoria(res),
    setTaiteenalat(res),
    setTieteenalat(res),
    setTekijanRooli(res),
    setValtiot(res),
    setJulkaisunLuokat(res),
    TestFunction());
}


function TestFunction() {
    console.log("Testing scheduler");
}
// Used for apis where you need to combine multiple external api calls and set redis later
// when you have combined the data
function HTTPGETcombiner (URL: String, res: Response, objecthandler: Function ) {
    https.get(URL, (resp: Response) => {
        let data = "";
        resp.on("data", (chunk: any) => {
            data += chunk;
        });
        resp.on("end", () => {
            const newdata = JSON.parse(data);
            objecthandler(newdata);
            console.log("Set info for " + objecthandler.name + " to redis successfully!");
        });
    })
    .on("error", (err: Error) => {
        console.log("Error: " + err.message);
    });
}

function HTTPGETshow (URL: String, res: Response, objecthandler: Function, secondURL?: String) {
    if (secondURL) {
        const urls = [URL, secondURL];
        const first: object []  = [
        ];
        const second: object [] = [
        ];
        const combined: object [] = [
        ];
        let requests: number = 0;
        for (const i in urls) {
        let data = "";
        https.get(urls[i], (resp: Response) => {
            resp.on("data", (chunk: any) => {
                data += chunk;
            });
            resp.on("end", () => {
                requests ++;
                if (requests === 1) {
                    first.push(JSON.parse(data));
                }
                if (requests === 2) {
                // console.log("combined data as string" + data);
                second.push(JSON.parse(data));
                    combined.push(JSON.parse(JSON.stringify(first)), JSON.parse(JSON.stringify(second)));
                        // console.log("This is the data : " + combined);
                        res.send(objecthandler(JSON.parse(JSON.stringify(combined))));
                }
            });
        })
        .on("error", (err: Error) => {
            console.log("Error: " + err.message);
        });
        }
    }
    else {
    https.get(URL, (resp: Response) => {
        let data = "";
        resp.on("data", (chunk: any) => {
            data += chunk;
        });
        resp.on("end", () => {
            const newdata = JSON.parse(data);
            res.send(objecthandler(newdata));
        });
    })
    .on("error", (err: Error) => {
        console.log("Error: " + err.message);
    });
    }
}

function HTTPGET (URL: String, res: Response, redisInfo: String, objecthandler: Function, orgid?: any) {
    if (objecthandler.name === "ObjectHandlerOrgListaus") {
        const somnething: object [] = [];
        let requests: number = 0;
        for (const i in orgid) {
        if (orgid[i][0] === "4") {
            https.get("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/tutkimusorganisaatio/koodi/tutkimusorganisaatio_" + orgid[i], (resp: Response) => {
                let data = "";
                resp.on("data", (chunk: any) => {
                    data += chunk;
                });
                resp.on("end", () => {
                    requests ++;
                   // The data needs to be in in Object form for us to parse it before adding it to redis
                    const newdata = JSON.parse(data);
                    somnething.push(newdata);
                    if (requests === orgid.length) {
                    client.set(redisInfo, JSON.stringify(objecthandler(somnething, orgid)));

                    }
                });
            })
            .on("error", (err: Error) => {
                console.log("Error: " + err.message);
            });
        }
        else {
        https.get("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/oppilaitosnumero/koodi/oppilaitosnumero_" + orgid[i], (resp: Response) => {
            let data = "";
            resp.on("data", (chunk: any) => {
                data += chunk;
            });
            resp.on("end", () => {
                requests ++;
               // The data needs to be in in Object form for us to parse it before adding it to redis
                const newdata = JSON.parse(data);
                somnething.push(newdata);
                if (requests === orgid.length) {
                client.set(redisInfo, JSON.stringify(objecthandler(somnething, orgid)));
                }
            });
        })
        .on("error", (err: Error) => {
            console.log("Error: " + err.message);
        });
    }
    }
    }
    else {
    https.get(URL, (resp: Response) => {
        let data = "";
        resp.on("data", (chunk: any) => {
            data += chunk;
        });
        resp.on("end", () => {
           // The data needs to be in in Object form for us to parse it before adding it to redis
            const newdata = JSON.parse(data);
            client.set(redisInfo, JSON.stringify(objecthandler(newdata)));
            console.log("Set info for " + redisInfo + " from Objecthandlers to redis successfully!");
        });
    })
    .on("error", (err: Error) => {
        console.log("Error: " + err.message);
    });
}
}


function setJulkaisunTilat(res: Response): void {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisuntila/koodi?onlyValidKoodis=false", res, "getJulkaisunTilat", OH.ObjectHandlerJulkaisuntilat);
}
function setKielet(res: Response) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/kieli/koodi?onlyValidKoodis=false", res, "getKielet", OH.ObjectHandlerKielet);
}
function setValtiot(res: Response) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/maatjavaltiot2/koodi?onlyValidKoodis=false", res, "getValtiot", OH.ObjectHandlerValtiot);
}
function setTaideAlanTyyppiKategoria(res: Response) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/taidealantyyppikategoria/koodi?onlyValidKoodis=false", res, "getTaideAlanTyyppiKategoria", OH.ObjectHandlerTaidealantyyppikategoria);
}
function setTaiteenalat(res: Response) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/taiteenala/koodi?onlyValidKoodis=false", res, "getTaiteenalat", OH.ObjectHandlerTaiteenalat);
}
function setTieteenalat(res: Response) {
    HTTPGETcombiner("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/paatieteenala/koodi?onlyValidKoodis=false", res, OH.ObjectHandlerTieteenalat);
}
function setTekijanRooli(res: Response) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisuntekijanrooli/koodi?onlyValidKoodis=false", res, "getTekijanRooli", OH.ObjectHandlerRoolit);
}
function setJulkaisunLuokat(res: Response) {
    HTTPGETcombiner("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisunpaaluokka/koodi?onlyValidKoodis=false", res, OH.ObjectHandlerJulkaisunluokat);
}
function setAlaYksikot(res: Response) {
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/alayksikkokoodi/koodi?onlyValidKoodis=false", res, "getAlayksikot", OH.ObjectHandlerAlayksikot);
}
function setOrgListaus(res: Response) {
    const orgid = ["00000", "02535", "02536", "02623", "10056",  "02631",  "02467",  "02504",  "02473",  "02469",  "10118",  "02470",  "02629",  "02358",  "10065",  "02507",  "02472",  "02630",  "10066", "02557", "02537", "02509", "10103", "02471", "4940015", "4020217", "4100010"];
    HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/oppilaitosnumero/koodi/oppilaitosnumero_" , res, "getOrgListaus", OH.ObjectHandlerOrgListaus, orgid);
}

// function setAvainSanat(res: Response) {
//     HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisunpaaluokka/koodi?onlyValidKoodis=false", res, "getJulkaisunLuokat");
// }
// function setJulkaisuSarjat(res: Response) {
//     HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisunpaaluokka/koodi?onlyValidKoodis=false", res, "getJulkaisunLuokat");
// }
// function setKonferenssinimet(res: Response) {
//     HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisunpaaluokka/koodi?onlyValidKoodis=false", res, "getJulkaisunLuokat");
// }
// function setKustantajat(res: Response) {
//     HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisunpaaluokka/koodi?onlyValidKoodis=false", res, "getJulkaisunLuokat");
// }
// function setJufoTiedot(res: Response) {
//     HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisunpaaluokka/koodi?onlyValidKoodis=false", res, "getJulkaisunLuokat");
// }
// function setJufotISSN(res: Response) {
//     HTTPGET("https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/julkaisunpaaluokka/koodi?onlyValidKoodis=false", res, "getJulkaisunLuokat");
// }


module.exports = {
HTTPGETshow: HTTPGETshow,
};