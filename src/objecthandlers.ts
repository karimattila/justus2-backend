/*  Alot of theese ObjectHandlers will look identical but we are still using
    different ObjectHandlers for now, just incase we want to modify
    the JSON response its easier to have them in separate functions
*/

// Objecthandler for Koodistopalvelu kielet
function ObjectHandlerKielet(obj: any): object[] {
    const kielet: object[] = [
    ];
    obj.forEach((e: any) => {
        const selite = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: selite.nimi,
        };
        kielet.push(keyvalues);
        // console.log(keyvalues.arvo + " / HELLO / " +  keyvalues.selite);
    });
        return kielet;
}
// Objecthandler for Koodistopalvelu maat ja valtiot
function ObjectHandlerValtiot(obj: any): object[] {
    const valtiot: object[] = [
    ];
    obj.forEach((e: any) => {
        const selite = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: selite.nimi,
        };
        valtiot.push(keyvalues);
        // console.log(keyvalues.arvo + " / HELLO / " +  keyvalues.selite);
    });
        return valtiot;
}
// Objecthandler for Koodistopalvelu roolit
function ObjectHandlerRoolit(obj: any): object[] {
    const roolit: object[] = [
    ];
    obj.forEach((e: any) => {
        const selite = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: selite.nimi,
        };
        roolit.push(keyvalues);
        // console.log(keyvalues.arvo + " / HELLO / " +  keyvalues.selite);
    });
        return roolit;
}
// Objecthandler for Koodistopalvelu taiteenalat
function ObjectHandlerTaiteenalat(obj: any): object[] {
    const taiteenalat: object[] = [
    ];
    obj.forEach((e: any) => {
        const selite = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: selite.nimi,
        };
        taiteenalat.push(keyvalues);
        // console.log(keyvalues.arvo + " / HELLO / " +  keyvalues.selite);
    });
        return taiteenalat;
}
// Objecthandler for Koodistopalvelu tieteenalat
function ObjectHandlerTieteenalat(obj: any): object[] {
    const tieteenalat: object[] = [
    ];
    obj.forEach((e: any) => {
        const selite = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: selite.nimi,
        };
        tieteenalat.push(keyvalues);
        // console.log(keyvalues.arvo + " / HELLO / " +  keyvalues.selite);
    });
        return tieteenalat;
}
// Objecthandler for Koodistopalvelu taidealantyyppikategoriat
function ObjectHandlerTaidealantyyppikategoria(obj: any): object[] {
    const taidealantyyppikategoria: object[] = [
    ];
    obj.forEach((e: any) => {
        const selite = e.metadata.find( (e: any) => e.kieli === "FI");
        const keyvalues = {
            arvo: e.koodiArvo,
            selite: selite.nimi,
        };
        taidealantyyppikategoria.push(keyvalues);
        // console.log(keyvalues.arvo + " / HELLO / " +  keyvalues.selite);
    });
        return taidealantyyppikategoria;
}
// Objecthandler for Koodistopalvelu julkaisuntilat
function ObjectHandlerJulkaisuntilat(obj: any): object[] {
    const julkaisuntilat: object[] = [
    ];
    obj.forEach((e: any) => {
        if ( (e["koodiArvo"] === "1" || e["koodiArvo"] === "-1" || e["koodiArvo"] === "2" || e["koodiArvo"] === "0")) {
            const selite = e.metadata.find(( e: any ) => e.kieli === "FI");
            const keyvalues = {
                arvo: e.koodiArvo,
                selite: selite.nimi,
                kuvaus: selite.kuvaus,
            };
            julkaisuntilat.push(keyvalues);
        }
    });
        return julkaisuntilat;
}




module.exports = {
    ObjectHandlerKielet: ObjectHandlerKielet,
    ObjectHandlerValtiot: ObjectHandlerValtiot,
    ObjectHandlerRoolit: ObjectHandlerRoolit,
    ObjectHandlerTaiteenalat: ObjectHandlerTaiteenalat,
    ObjectHandlerTieteenalat: ObjectHandlerTieteenalat,
    ObjectHandlerTaidealantyyppikategoria: ObjectHandlerTaidealantyyppikategoria,
    ObjectHandlerJulkaisuntilat: ObjectHandlerJulkaisuntilat,
};