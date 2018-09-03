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
        taiteenalat.sort((a: any, b: any) => {
            const numA = a.arvo;
            const numB = b.arvo;
            if (numA < numB)
                return -1;
            if (numA > numB)
                return 1;
            return 0;
        });
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
        taidealantyyppikategoria.sort((a: any, b: any) => {
            const numA = a.arvo;
            const numB = b.arvo;
            if (numA < numB)
                return -1;
            if (numA > numB)
                return 1;
            return 0;
        });
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
                arvo: e.koodiArvo,
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

// Objecthandler for Avainsanat from FINTO
function ObjectHandlerAvainsanat(obj: any): object[] {
        return obj["results"].map((e: any) => {
            return {
                localname: e.localname,
                prefLabel: e.prefLabel,
                altLabel: e.altLabel,
                };
             });
}

// Objecthandler for Julkaisusarjat from FINTO
function ObjectHandlerJulkaisusarjat(obj: any): object[] {
    const julkaisusarjat: object [] = [
    ];
    if (obj instanceof Array) {
    obj.forEach((e: any)  => {
        const values = {
            Jufo_ID: e.Jufo_ID,
            Name: e.Name,
            Type: e.Type,
        };
        julkaisusarjat.push(values);
    });
    return julkaisusarjat;
    }
    else {
        return obj;
    }
}

// Objecthandler for Konferenssinnimet from FINTO
function ObjectHandlerKustantajat(obj: any): object[] {
    const Konferenssinnimet: object [] = [
    ];
    if (obj instanceof Array) {
    obj.forEach((e: any)  => {
        const values = {
            Jufo_ID: e.Jufo_ID,
            Name: e.Name,
            Type: e.Type,
        };
        Konferenssinnimet.push(values);
    });
    return Konferenssinnimet;
    }
    else {
        return obj;
    }
}

// Objecthandler for Konferenssinnimet from FINTO
function ObjectHandlerKonferenssinnimet(obj: any): object[] {
    const Konferenssinnimet: object [] = [
    ];
    if (obj instanceof Array) {
    obj.forEach((e: any)  => {
        const values = {
            Jufo_ID: e.Jufo_ID,
            Name: e.Name,
            Type: e.Type,
        };
        Konferenssinnimet.push(values);
    });
    return Konferenssinnimet;
    }
    else {
        return obj;
    }
}

// Objecthandler for Konferenssinnimet from FINTO
function ObjectHandlerJufoID(obj: any): object[] {
    const jufotiedot: object [] = [
    ];
    if (obj instanceof Array) {
    obj.forEach((e: any)  => {
        const values = {
            Jufo_2015: e.Jufo_2015,
            Abbreviation: e.Abbreviation,
            SJR_SJR: e.SJR_SJR,
            Other_Title: e.Other_Title,
            ModifiedAt: e.ModifiedAt,
            Continues: e.Continues,
            ISBN: e.ISBN,
            Professional: e.Professional,
            Denmark_Level: e.Denmark_Level,
            Active_Binary: e.Active_Binary,
            Field: e.Field,
            SNIP: e.SNIP,
            Name: e.Name,
            Website: e.Website,
            ISSN1: e.ISSN1,
            ISSNL: e.ISSNL,
            Grounds_Removal: e.Grounds_Removal,
            Jufo_ID: e.Jufo_ID,
            Year_End: e.Year_End,
            Publisher: e.Publisher,
            Scientific: e.Scientific,
            Language: e.Language,
            Jufo_2012: e.Jufo_2012,
            Continued_by: e.Continued_by,
            Jufo_2014: e.Jufo_2014,
            Type: e.Type,
            Title_Details: e.Title_Details,
            Norway_Level: e.Norway_Level,
            Sherpa_Romeo_Code: e.Sherpa_Romeo_Code,
            Substitutive_Channel: e.Substitutive_Channel,
            Year_Start: e.Year_Start,
            DOAJ_Index: e.DOAJ_Index,
            Fields: e.Fields,
            Country: e.Country,
            Jufo_history: e.Jufo_history,
            CreatedAt: e.CreatedAt,
            Active: e.Active,
            IPP: e.IPP,
            Level: e.Level,
            Subfield: e.Subfield,
            ISSN2: e.ISSN2,
            Jufo_2013: e.Jufo_2013,

        };
        jufotiedot.push(values);
    });
    return jufotiedot;
    }
    else {
        return obj;
    }
}
// Objecthandler for Jufo ISSN
function ObjectHandlerJufoISSN(obj: any): object[] {
    const tiedotbyissn: object [] = [
    ];
    if (obj instanceof Array) {
    obj.forEach((e: any)  => {
        const values = {
            Jufo_ID: e.Jufo_ID,
            Name: e.Name,
            Type: e.Type,
        };
        tiedotbyissn.push(values);
    });
    return tiedotbyissn;
    }
    else {
        return obj;
    }
}

// Nullchecker for julkaisutvirtaCR, used to check if authors exists
function nullchecker(doesauthorexist: any) {
    if (doesauthorexist == undefined) {
        return "";
    }
    else {
        return doesauthorexist.map((s: any) => s.given + " " + s.family);
    }
}
// Objecthandler for JulkaisutVIRTACR
function ObjectHandlerJulkaisutVIRTACR(obj: any): object[] {
    return obj.message.items.map((e: any) => {
        const authorsstuff = e.author;
        return {
            src: {
                lahde: e.source,
                id: e.DOI,
            },
            title: e.title[0],
            authors: nullchecker(authorsstuff),
            ISBN: e.ISBN,
            ISSN: e.ISSN,
            };
        });
    }

// WAIT FOR FURTHER INSTRUCTIONS, UNCLEAR RIGHT NOW
// function ObjectHandlerJulkaisutVIRTAPART(obj: any) {

// }
function ObjectHandlerVirtaEsitäyttö(obj: any): object[] {
    return obj;
}
function ObjectHandlerCrossrefEsitäyttö(obj: any): object[] {
    return obj;
}

function ObjectHandlerAllJulkaisut(obj: any) {
    return obj.map((x: any) => {
                return {
                    julkaisu: {
                        id: x.id,
                        organisaatiotunnus: x.organisaatiotunnus,
                        julkaisutyyppi: x.julkaisutyyppi,
                        julkaisuvuosi: x.julkaisuvuosi,
                        julkaisunnimi: x.julkaisunnimi,
                        tekijat: x.tekijat,
                        julkaisuntekijoidenlukumaara: x.julkaisuntekijoidenlukumaara,
                        konferenssinvakiintunutnimi: x.konferenssinvakiintunutnimi,
                        emojulkaisunnimi: x.emojulkaisunnimi,
                        isbn: x.isbn,
                        emojulkaisuntoimittajat: x.emojulkaisuntoimittajat,
                        lehdenjulkaisusarjannimi: x.lehdenjulkaisusarjannimi,
                        issn: x.issn,
                        volyymi: x.volyymi,
                        numero: x.numero,
                        sivut: x.sivut,
                        artikkelinumero: x.artikkelinumero,
                        kustantaja: x.kustantaja,
                        julkaisunkustannuspaikka: x.julkaisunkustannuspaikka,
                        julkaisunkieli: x.julkaisunkieli,
                        julkaisunkansainvalisyys: x.julkaisunkansainvalisyys,
                        julkaisumaa: x.julkaisumaa,
                        kansainvalinenyhteisjulkaisu: x.kansainvalinenyhteisjulkaisu,
                        yhteisjulkaisuyrityksenkanssa: x.yhteisjulkaisuyrityksenkanssa,
                        doitunniste: x.doitunniste,
                        pysyvaverkkoosoite: x.pysyvaverkkoosoite,
                        avoinsaatavuus: x.avoinsaatavuus,
                        julkaisurinnakkaistallennettu: x.julkaisurinnakkaistallennettu,
                        rinnakkaistallennetunversionverkkoosoite: x.rinnakkaistallennetunversionverkkoosoite,
                        lisatieto: x.lisatietoteksti,
                        jufotunnus: x.jufotunnus,
                        jufoluokitus: x.jufoluokitus,
                        julkaisuntila: x.julkaisuntila,
                        username: x.username,
                        modified: x.modified,

                    },
                    organisaatiotekija: [{
                        id: x.orgid,
                        etunimet: x.etunimet,
                        sukunimi: x.sukunimi,
                        orcid: x.orcid,
                        rooli: x.rooli,
                        alayksikko: x.alayksikko,
                    }],
                    tieteenala: [{
                        tieteenalakoodi: x.tieteenalakoodi,
                        jnro: x.jnro,
                    }],
                    taiteenala: [{
                        taiteenalakoodi: x.taiteenalakoodi,
                    }],
                    avainsanat: [
                        x.avainsanat,
                    ],
                    taidealantyyppikategoria: x.taidealantyyppikategoria,
                    lisatieto: {
                        julkaisuvuodenlisatieto: "",
                        tapahtuma: "",
                        julkistamispaikkakunta: "",
                        muutunniste: "",
                    }
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
    ObjectHandlerJulkaisusarjat: ObjectHandlerJulkaisusarjat,
    ObjectHandlerKonferenssinnimet: ObjectHandlerKonferenssinnimet,
    ObjectHandlerKustantajat: ObjectHandlerKustantajat,
    ObjectHandlerJufoID: ObjectHandlerJufoID,
    ObjectHandlerJufoISSN: ObjectHandlerJufoISSN,
    ObjectHandlerJulkaisutVIRTACR: ObjectHandlerJulkaisutVIRTACR,
    ObjectHandlerVirtaEsitäyttö: ObjectHandlerVirtaEsitäyttö,
    ObjectHandlerCrossrefEsitäyttö: ObjectHandlerCrossrefEsitäyttö,
    ObjectHandlerAllJulkaisut: ObjectHandlerAllJulkaisut,
};