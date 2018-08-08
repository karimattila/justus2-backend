/*  Alot of theese ObjectHandlers will look identical but we are still using
    different ObjectHandlers for now, just incase we want to modify
    the JSON response its easier to have them in separate functions
*/

import { Request, Response, NextFunction } from "express";
const https = require("https");

function testfunction (URL: String): object[] {
    const value: object[] = [
    ];
    let data = "";
    https.get(URL, (resp: Response) => {
        resp.on("data", (chunk: any) => {
            data += chunk;
        });
        resp.on("end", () => {
            const newdata = JSON.parse(data);
            value.push(newdata);
        });
    })
    .on("error", (err: Error) => {
        console.log("Error: " + err.message);
    });
    return value;
}



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
// Objecthandler for Koodistopalvelu tieteenalat
function ObjectHandlerTieteenalat(obj: any): object[] {
    const tieteenalat: object[] = [
    ];
    obj.forEach((e: any) => {
        const metadata = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata.nimi,
        };
        tieteenalat.push(keyvalues);
    });
        return tieteenalat;
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
// Objecthandler for Koodistopalvelu taidealantyyppikategoriat
function ObjectHandlerJulkaisunluokat(obj: any): object[] {
    const julkaisunluokat: object[] = [
    ];
    obj.forEach((e: any) => {
        const spec = e.koodiArvo;
        const specLC = spec.toLowerCase();
        const url: string = "https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/julkaisunpaaluokka_" + specLC;
        console.log(url);
        const alaluokatRAW = testfunction(url);
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
        });
        const metadata2 = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: metadata2.nimi,
            alatyyppi: alaluokat,
        };
        julkaisunluokat.push(keyvalues);
    });
        return julkaisunluokat;
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
};