import { Router, Request, Response } from "express";
// Defining our router
const router: Router = Router();
// Importing db const from queries.ts
const db = require("../queries");


// Define the routes here, all will have the prexix /api/ as per the proxypass in the apache settings
// GET requests here
router.get("/julkaisut/lista/all", db.getJulkaisut);
router.get("/julkaisut/lista/:organisaatiotunnus", db.getJulkaisuListaforOrg);
router.get("/julkaisu/tiedot/:id", db.getAjulkaisu);
router.get("/org/:id", db.getOrgTekija);
router.get("/haku/julkaisunluokat", db.getJulkaisunLuokat);
router.get("/haku/julkaisuntilat", db.getJulkaisunTilat);
router.get("/haku/tekijanrooli", db.getTekijanRooli);
router.get("/haku/kielet", db.getKielet);
router.get("/haku/valtiot", db.getValtiot);
router.get("/haku/taidealantyyppikategoria", db.getTaideAlanTyyppiKategoria);
router.get("/haku/taiteenalat", db.getTaiteenalat);
router.get("/haku/tieteenalat", db.getTieteenalat);
router.get("/haku/alayksikot", db.getAlaYksikot);
router.get("/haku/avainsanat?q={keyword}", db.getAvainSanat);
router.get("/haku/julkaisusarjat/?q={keyword}", db.getJulkaisuSarjat);
router.get("/haku/konferenssinnimet/?q={keyword}", db.getKonferenssinimet);
router.get("/haku/kustantajat/?q={keyword}", db.getKustantajat);
router.get("/haku/jufo/{jufoId}", db.getJufo);
router.get("/haku/jufot/?issn={issnNumber}", db.getJufotISSN);
router.get("/haku/julkaisut/?q={keyword}", db.getJulkaisutVIRTACF);
router.get("/haku/julkaisu/?lahde=virta&id=abc", db.getJulkaisuVirta);
router.get("/haku/julkaisu/?lahde=crossref&id=def", db.getJulkaisuCrossref);
router.get("/user", db.getUser);

// POST requests here
router.post("/julkaisu", db.postJulkaisu);
router.post("/org/", db.postOrg);
router.post("/admin/impersonate", db.postAdminImpersonate);
router.post("/admin/action", db.postAdminAction);

// Put requests here
router.put("/julkaisu/{julkaisuid}", db.putJulkaisu);
router.put("/julkaisuntila", db.putJulkaisuntila);

export = router;

