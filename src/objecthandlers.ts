

// Objecthandler for Koodistopalvelu kielet
function ObjectHandlerKielet(obj: any): object[] {
    // console.log("obj: " + obj);
    const kielet: object[] = [
    ];
    obj.forEach((e: any) => {
        // console.log("Inenrobje elemnt: " + e);
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
    // console.log("obj: " + obj);
    const valtiot: object[] = [
    ];
    obj.forEach((e: any) => {
        // console.log("Inenrobje elemnt: " + e);
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
    // console.log("obj: " + obj);
    const roolit: object[] = [
    ];
    obj.forEach((e: any) => {
        // console.log("Inenrobje elemnt: " + e);
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




module.exports = {
    ObjectHandlerKielet: ObjectHandlerKielet,
    ObjectHandlerValtiot: ObjectHandlerValtiot,
    ObjectHandlerRoolit: ObjectHandlerRoolit,
};