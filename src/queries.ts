import { Request, Response, NextFunction } from "express";
const schedule = require("node-schedule");
// https will be used for external API calls
const https = require("https");
const promise = require("bluebird");
const kp = require("./koodistopalvelu");
// Options used for our pgp const
const options = {
    promiseLib: promise
};

// Initializing postgres connection by using pg-promise
const pgp = require("pg-promise")(options);
// Connection string for the database, move this to a ENV.variable later
const conString = process.env.PG_URL;
// const db will be used for all queries etc. db.any, db.none and so on
const db = pgp(conString);

// Redis client
const redis = require("redis");
const client = redis.createClient();

// Scheduler for updating Koodistopalvelu data inside redis
// Each star represents a different value, beginning from second and ending in day
// So if we want to update it once a day at midnight we would use ("* 0 0 * * *")

const getRedis = (rediskey: string, success: any, error: any) => {
    client.get(rediskey, function (err: Error, reply: any) {
        if (!err) {
            success(reply);
        }
        else {
            error(err);
        }
    });
};

// Add Query functions here and define them in the module.exports at the end
// All GET requests first
// Get all julkaisut
function getJulkaisut(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu")
        .then((data: any) => {
            res.status(200)
                .json({
                    data: data
    });
})
        .catch((err: any) => {
        return next(err);
});
}

// Get a specific julkaisu by "id"
function getAjulkaisu(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu where id = ${id}", {
        id: req.params.id
    })
        .then((data: any) => {
            res.status(200)
                .json({
                    data: data
                });
            })
                .catch((err: any) => {
                return next(err);
        });
}

// Get all julkaisut that belong to a specific organisation
function getJulkaisuListaforOrg(req: Request, res: Response, next: NextFunction) {
    db.any("select * from julkaisu where organisaatiotunnus = ${organisaatiotunnus}", {
        organisaatiotunnus: req.params.organisaatiotunnus
    })
        .then((data: any) => {
            res.status(200)
                .json({
                    data: data
                });
            })
                .catch((err: any) => {
                return next(err);
        });
}
// Get org tekija, just a test
function getOrgTekija(req: Request, res: Response, next: NextFunction) {
    db.any("select * from organisaatiotekija where id = ${id}", {
        id: req.params.id
    })
    .then((data: any) => {
        res.status(200)
            .json({
                data: data
            });
        })
            .catch((err: any) => {
            return next(err);
    });
}

// KOODISTOPALVELU GETS

function getJulkaisunTilat(req: Request, res: Response, next: NextFunction) {
    getRedis("getJulkaisunTilat", function success(reply: any) {
        res.status(200).json({
            message: JSON.parse(reply)
        });
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getTekijanRooli(req: Request, res: Response, next: NextFunction) {
    getRedis("getTekijanRooli", function success(reply: any) {
        res.status(200).json({
            message: JSON.parse(reply)
        });
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getKielet(req: Request, res: Response, next: NextFunction) {
    getRedis("getKielet", function success(reply: any) {
        res.status(200).json({
            message: JSON.parse(reply)
        });
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getValtiot(req: Request, res: Response, next: NextFunction) {
        getRedis("getValtiot", function success(reply: any) {
            res.status(200).json({
                message: JSON.parse(reply)
            });
    }, function error(err: Error) {
        console.log("Something went wrong");
    });
}
function getTaideAlanTyyppiKategoria(req: Request, res: Response, next: NextFunction) {
    getRedis("getTaideAlanTyyppiKategoria", function success(reply: any) {
        res.status(200).json({
            message: JSON.parse(reply)
        });
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getTaiteenalat(req: Request, res: Response, next: NextFunction) {
    getRedis("getTaiteenalat", function success(reply: any) {
        res.status(200).json({
            message: JSON.parse(reply)
        });
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getTieteenalat(req: Request, res: Response, next: NextFunction) {
    getRedis("getTieteenalat", function success(reply: any) {
        res.status(200).json({
           message: JSON.parse(reply)
        });
}, function error(err: Error) {
    console.log("Something went wrong");
});
}
function getJulkaisunLuokat(req: Request, res: Response, next: NextFunction) {
    getRedis("getJulkaisunLuokat", function success(reply: any) {
        res.status(200).json({
           message: JSON.parse(reply)
        });
}, function error(err: Error) {
    console.log("Something went wrong");
});
}

// NOT SURE IF NEEDED

// function getAlaYksikot(req: Request, res: Response, next: NextFunction) {
//         client.get("getAlaYksikot", function(err: Error, reply: any) {
//             if (!err) {
//                 res.status(200).json({
//                     message: JSON.parse(reply)
//                 });
//             }
//             else {
//                 res.send("Something went wrong");
//             }
//         });
// }

function getJulkaisuCrossref(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getUser(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getAvainSanat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisuSarjat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getKonferenssinimet(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getKustantajat(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJufo(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJufotISSN(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisutVIRTACF(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function getJulkaisuVirta(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}


// POST requests
// Post a julkaisu to the database
function postJulkaisu(req: Request, res: Response, next: NextFunction) {
    db.none("INSERT INTO julkaisu DEFAULT VALUES")
    .then(function() {
        res.status(200)
        .json({
            message: "Insert successful"
        });
    })
    .catch(function(err: any) {
    return next(err);
});
}


// Post orgtekija, just a test
function postOrg(req: Request, res: Response, next: NextFunction) {
    db.none("INSERT INTO organisaatiotekija VALUES (2, 5, 'Victor', 'Tester', 'csc', 'Seniorez Developez')")
    .then(function() {
        res.status(200)
        .json({
            message: "Insert successful"
        });
    })
    .catch(function(err: any) {
    return next(err);
});
}

function postAdminImpersonate(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function postAdminAction(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}

// PUT requests
function putJulkaisu(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}
function putJulkaisuntila(req: Request, res: Response, next: NextFunction) {
    // TODO ADD CODE HERE
}





module.exports = {
    // GET requests
    getOrgTekija: getOrgTekija,
    getJulkaisut: getJulkaisut,
    getAjulkaisu: getAjulkaisu,
    getJulkaisuListaforOrg: getJulkaisuListaforOrg,
    getJulkaisunLuokat: getJulkaisunLuokat,
    getJulkaisunTilat: getJulkaisunTilat,
    getTekijanRooli: getTekijanRooli,
    getKielet: getKielet,
    getValtiot: getValtiot,
    getTaideAlanTyyppiKategoria: getTaideAlanTyyppiKategoria,
    getTaiteenalat: getTaiteenalat,
    getTieteenalat: getTieteenalat,
    getUser: getUser,
    getAvainSanat: getAvainSanat,
    getJulkaisuSarjat: getJulkaisuSarjat,
    // Perhaps not neededs
    // getAlaYksikot: getAlaYksikot,
    getKonferenssinimet: getKonferenssinimet,
    getKustantajat: getKustantajat,
    getJufo: getJufo,
    getJufotISSN: getJufotISSN,
    getJulkaisutVIRTACF: getJulkaisutVIRTACF,
    getJulkaisuVirta: getJulkaisuVirta,
    getJulkaisuCrossref: getJulkaisuCrossref,
    // POST requests
    postJulkaisu: postJulkaisu,
    postOrg: postOrg,
    postAdminAction: postAdminAction,
    postAdminImpersonate: postAdminImpersonate,
    // PUT requests
    putJulkaisu: putJulkaisu,
    putJulkaisuntila: putJulkaisuntila,

};
