import { Router, Request, Response } from "express";
import { DocsControlles } from "../controllers";
import Container from "typedi";
import  * as  multer from 'multer';
const upload = multer({ dest: 'uploads/' })


const ImportDocs = Router();
const controller = Container.get(DocsControlles);

ImportDocs.route("/v1/import",  upload.single("import")).post((req: Request, res: Response, next) => {
 Promise.resolve().then(function () {
      return controller.importData(req.body, res);
  }).catch(next)
});

ImportDocs.route("/v1/relacao").get((req: Request, res: Response, next) => {
  Promise.resolve().then(function(){
      return controller.getRelatioship(req, res);
  })
})

export { ImportDocs };
