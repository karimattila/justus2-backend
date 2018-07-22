import { Router, Request, Response } from "express";
const router: Router = Router();
const pgp = require("pg-promise")({
});
const cn = "postgres://appaccount:postgres@10.10.10.10:5432/justus";
const db = pgp(cn);

router.get("/gettest", function(req: Request, res: Response) {
        res.send("Handling GETs for the /api");
        console.log(db.connect());

});

router.post("/posttest", function(req: Request, res: Response) {
    res.send("Handling POST for the /api");
});

router.delete("/deltest", function(req: Request, res: Response) {
    res.send("Handling Dels for the /api");
});

export = router;
module.exports = db;

// export router as apiRouter;
