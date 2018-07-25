import { Router, Request, Response } from "express";
const router: Router = Router();
// const pgp = require("pg-promise")(options);
// const cn = "postgres://appaccount:postgres@10.10.10.10:5432/justus";
const db = require("../queries");

router.get("/julkaisut", db.getJulkaisut);
router.post("/julkaisu", db.postJulkaisu);
router.get("/julkaisu/:id", db.getAjulkaisu);
router.post("/org/", db.postOrg);
router.get("/org/:id", db.getOrgTekija);

router.post("/posttest", function(req: Request, res: Response) {
    res.send("Handling POST for the /api");
});

router.delete("/deltest", function(req: Request, res: Response) {
    res.send("Handling Dels for the /api");
});

export = router;
// module.exports = db;

// export router as apiRouter;
