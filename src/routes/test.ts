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

router.get("/", function(req: Request, res: Response) {
        res.send("Handling GETs for the /api");
});

router.post("/", function(req: Request, res: Response) {
    res.send("Handling POST for the /api");
});

export const testRouter: Router = router;
