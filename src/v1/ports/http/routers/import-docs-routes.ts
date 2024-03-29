import { Router, Request, Response } from "express";
import { DocsControlles } from "../controllers";
import Container from "typedi";
import * as  fileupload from "express-fileupload";

const ImportDocs = Router();
const controller = Container.get(DocsControlles);
ImportDocs.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
ImportDocs.route("/v1/import").post((req: Request, res: Response, next) => {
  const token = req.body.t;
  res.redirect(`/docs?t=${token}&status=true`);
  controller.importData({ bilhetagem: req.files.bilhetagem, gps: req.files.gps }, res, next);
});
ImportDocs.route("/v1/relacao").get((req: Request, res: Response, next) => {
  Promise.resolve().then(function () {
    return controller.getRelatioship(req.params, res);
  })
})

ImportDocs.route("/v1/relacao/cron").get((req: Request, res: Response, next) => {
  Promise.resolve().then(function () {
    return controller.saveRelatioship(req.params, res);
  })
})

export { ImportDocs };
