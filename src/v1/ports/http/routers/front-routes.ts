import { Router, Request, Response } from "express";
import * as express from "express";
import * as  multer from 'multer';
import { UserControlles } from "../controllers";
import Container from 'typedi';
const upload = multer({ dest: 'uploads/' })

const Front = Router();
Front.use(express.static("public"));

const controller = Container.get(UserControlles);
Front.route("/").get((req: Request, res: Response) => {
  res.send("To aqui")
});

Front.route("/docs").get((req: Request, res: Response) => {
  res.sendFile("/doc.html");
})

Front.route('/login').get((req: Request, res: Response) => {
  res.sendFile("/login.html");
});

Front.route('/logar').post((req: Request, res: Response) => {
  return controller.logar(req.body, res);
})


export { Front };
