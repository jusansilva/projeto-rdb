import { Router, Request, Response } from "express";
import { Container } from 'typedi';
import { UserControlles } from "../controllers";
import { CreateUserRequest } from "v1/adapters/request";

const User = Router();

const controller = Container.get(UserControlles);
User.route("/v1/user").post((req: CreateUserRequest, res: Response) => {
  return controller.create(req.body, res);
});


User.route('/v1/logar').post((req: Request, res: Response) => {
  const authorization= req.headers.authorization?.toString();
  return controller.logar(req.body, res, authorization);
})

export { User }