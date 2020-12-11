import { Router, Request, Response } from "express";
import { DocsControlles } from "../controllers";
import Container from "typedi";
import { ImportRequest } from "../../../adapters/request";

const ImportDocs = Router();
const controller = Container.get(DocsControlles);

ImportDocs.route("/v1/import").post((req: Request, res: Response, next) => {
 Promise.resolve().then(function () {
      return controller.importData(req.body, res);
  }).catch(next)
});

export { ImportDocs };
