/*  Alot of theese ObjectHandlers will look identical but we are still using
    different ObjectHandlers for now, just incase we want to modify
    the JSON response its easier to have them in separate functions
*/

import { Request, Response, NextFunction } from "express";
const https = require("https");
const redis = require("redis");
const client = redis.createClient();


// Objecthandler for Koodistopalvelu kielet
function ObjectHandlerKielet(obj: any): object[] {
    const kielet: object[] = [
    ];
    obj.forEach((e: any) => {
        const metadata = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata.nimi,
        };
        kielet.push(keyvalues);
    });
        return kielet;
}
// Objecthandler for Koodistopalvelu maat ja valtiot
function ObjectHandlerValtiot(obj: any): object[] {
    const valtiot: object[] = [
    ];
    obj.forEach((e: any) => {
        const metadata = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata.nimi,
        };
        valtiot.push(keyvalues);
    });
        return valtiot;
}
// Objecthandler for Koodistopalvelu roolit
function ObjectHandlerRoolit(obj: any): object[] {
    const roolit: object[] = [
    ];
    obj.forEach((e: any) => {
        const metadata = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata.nimi,
        };
        roolit.push(keyvalues);
    });
        return roolit;
}
// Objecthandler for Koodistopalvelu taiteenalat
function ObjectHandlerTaiteenalat(obj: any): object[] {
    const taiteenalat: object[] = [
    ];
    obj.forEach((e: any) => {
        const metadata = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata.nimi,
        };
        taiteenalat.push(keyvalues);
    });
        return taiteenalat;
}
// Objecthandler for Koodistopalvelu taidealantyyppikategoriat
function ObjectHandlerTaidealantyyppikategoria(obj: any): object[] {
    const taidealantyyppikategoria: object[] = [
    ];
    obj.forEach((e: any) => {
        const metadata = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata.nimi,
        };
        taidealantyyppikategoria.push(keyvalues);
    });
        return taidealantyyppikategoria;
}
// Objecthandler for Koodistopalvelu julkaisuntilat
function ObjectHandlerJulkaisuntilat(obj: any): object[] {
    const julkaisuntilat: object[] = [
    ];
    obj.forEach((e: any) => {
        if ( (e.koodiArvo === "1" || e.koodiArvo === "-1" || e.koodiArvo === "2" || e.koodiArvo === "0")) {
            const metadata = e.metadata.find(( e: any ) => e.kieli === "FI");
            const keyvalues = {
                arvo: e.koodiArvo,
                selite: metadata.nimi,
                kuvaus: metadata.kuvaus,
            };
            julkaisuntilat.push(keyvalues);
        }
    });
        return julkaisuntilat;
}


function httpgetCombiner(URL: String, callback: Function) {
    let data = "";
    https.get(URL, (resp: Response) => {
        resp.on("data", (chunk: any) => {
            data += chunk;
        });
        resp.on("end", () => {
            const newdata = JSON.parse(data);
            callback(newdata);
        });
    })
    .on("error", (err: Error) => {
        console.log("Error: " + err.message);
    });
}

// Objecthandler for Koodistopalvelu alayksikot
function ObjectHandlerAlayksikot(obj: any): object[] {
    const alayksikot: object[] = [
    ];
    obj.forEach((e: any) => {
            const metadata = e.metadata.find(( e: any ) => e.kieli === "FI");
            const keyvalues = {
                arvo: e.koodiArvo.split("-").pop(),
                selite: metadata.nimi,
            };
            alayksikot.push(keyvalues);
    });
        return alayksikot;
}

// Objecthandler for Koodistopalvelu tieteenalat
function ObjectHandlerTieteenalat(obj: any) {
    const tieteenalat: object[] = [
    ];
    obj.forEach((e: any) => {
        const determinator = e.koodiArvo;
        const url: string = "https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/tieteenala/koodi?onlyValidKoodis=false";
        httpgetCombiner(url, parse);
        function parse(alatieteenalatRAW: object[]) {
            const alatieteenalat: object[] = [
            ];
            alatieteenalatRAW.forEach((e: any) => {
                const determinatormatch = e.koodiArvo[0];
                if ( determinator === determinatormatch ) {
                const metadata = e.metadata.find((e: any) => e.kieli === "FI");
                const al_keyvalues = {
                    arvo: e.koodiArvo,
                    selite: metadata.nimi,
                };
                alatieteenalat.push(al_keyvalues);
                alatieteenalat.sort((a: any, b: any) => {
                    const numA = a.arvo;
                    const numB = b.arvo;
                    if (numA < numB)
                        return -1;
                    if (numA > numB)
                        return 1;
                    return 0;
                });
            }});
            combine(alatieteenalat);
        }
        function combine(alatieteenalat: object[]) {
        const metadata2 = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata2.nimi,
            alatyypit: alatieteenalat,
        };
        tieteenalat.push(keyvalues);
        tieteenalat.sort((a: any, b: any) => {
            const numA = a.arvo;
            const numB = b.arvo;
            if (numA < numB)
                return -1;
            if (numA > numB)
                return 1;
            return 0;
        });
        settoRedis("getTieteenalat", tieteenalat);
    }
});
        return tieteenalat;
}


// Objecthandler for Koodistopalvelu taidealantyyppikategoriat
function ObjectHandlerJulkaisunluokat(obj: any) {
    const julkaisunluokat: object[] = [
    ];

    obj.forEach((e: any) => {
        const spec = e.koodiArvo.toLowerCase();
        const url: string = "https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/julkaisunpaaluokka_" + spec;
        httpgetCombiner(url, parse);
        function parse(alaluokatRAW: object[]) {
            const alaluokat: object[] = [
            ];
            alaluokatRAW.forEach((e: any) => {
                const metadata = e.metadata.find((e: any) => e.kieli === "FI");
                const al_keyvalues = {
                    arvo: e.koodiArvo,
                    selite: metadata.nimi,
                    kuvaus: metadata.kuvaus,
                };
                alaluokat.push(al_keyvalues);
                alaluokat.sort((a: any, b: any) => {
                    const numA = a.arvo[1];
                    const numB = b.arvo[1];
                    if (numA < numB)
                        return -1;
                    if (numA > numB)
                        return 1;
                    return 0;
                });
            });
            combine(alaluokat);
        }
        function combine(alaluokat: object[]) {
        const metadata2 = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata2.nimi,
            alatyypit: alaluokat,
        };
        julkaisunluokat.push(keyvalues);
        julkaisunluokat.sort((a: any, b: any) => {
            const nameA = a.arvo;
            const nameB = b.arvo;
            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        });
        settoRedis("getJulkaisunLuokat", julkaisunluokat);
    }
});
        return julkaisunluokat;


}

function settoRedis(rediskey: string, obj: object[]) {
    client.set(rediskey, JSON.stringify(obj));
    console.log("Set info for " + rediskey + " from ObjectHandlers to redis successfully!");
}


function ObjectHandlerAvainsanat(obj: any): object[] {
        return obj["results"].map((x: any) => {
            return {
                localname: x.localname,
                prefLabel: x.prefLabel,
                altLabel: x.altLabel,
                };
             });
}




module.exports = {
    ObjectHandlerKielet: ObjectHandlerKielet,
    ObjectHandlerValtiot: ObjectHandlerValtiot,
    ObjectHandlerRoolit: ObjectHandlerRoolit,
    ObjectHandlerTaiteenalat: ObjectHandlerTaiteenalat,
    ObjectHandlerTieteenalat: ObjectHandlerTieteenalat,
    ObjectHandlerTaidealantyyppikategoria: ObjectHandlerTaidealantyyppikategoria,
    ObjectHandlerJulkaisuntilat: ObjectHandlerJulkaisuntilat,
    ObjectHandlerJulkaisunluokat: ObjectHandlerJulkaisunluokat,
    ObjectHandlerAlayksikot: ObjectHandlerAlayksikot,
    ObjectHandlerAvainsanat: ObjectHandlerAvainsanat,
};