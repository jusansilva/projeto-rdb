import { Router, Request, Response } from "express";
import Container from "typedi";
import  * as  multer from 'multer';
const upload = multer({ dest: 'uploads/' })


const ViewsRouter = Router();

ViewsRouter.route("/").get((req: Request, res: Response, next) => {
      return res.send("to aqui");
});

ViewsRouter.route("/login").get(async (req: Request, res: Response, next) => {
  return await res.sendFile("/Users/jusanmagno/projetos/Projeto RDB/dist/views/login.html")
})

ViewsRouter.route("/doc", upload.single("import")).get(async (req: Request, res: Response, next) => {
  
})

export { ViewsRouter };
