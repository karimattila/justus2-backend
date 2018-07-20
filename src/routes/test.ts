/**
 * GET /
 * Home page.
 */
// export let mainGet = (req: Request, res: Response) => {
//     res.status(200).json({
//       message: "Handling GET requests to /api"
//     });
//   };

//   export let mainPost = (req: Request, res: Response) => {
//     res.status(200).json({
//       message: "Handling Post requests to /api"
//     });
//   };



import { Router, Request, Response } from "express";
const router: Router = Router();

router.get("/gettest", function(req: Request, res: Response) {
        res.send("Handling GETs for the /api");
});

router.post("/posttest", function(req: Request, res: Response) {
    res.send("Handling POST for the /api");
});

router.delete("/deltest", function(req: Request, res: Response) {
    res.send("Handling Dels for the /api");
});

export = router;

// export router as apiRouter;
