import { Router, Request, Response } from "express";
import * as express from "express";
import { UserControlles } from "../controllers";
import Container from 'typedi';
import * as path from 'path';

const Front = Router();
Front.use(express.static("public"));
Front.use(sendViewMiddleware);


const controller = Container.get(UserControlles);
Front.route("/").get((req: Request, res: Response) => {
  // const token = res.header['x-access-token']
  // if (token) {
  //   res.redirect(`/docs?t${token}`);
  // }
  res.redirect("/login");
});

Front.route("/docs").get(async (req: Request, res: Response) => {
  const auth = req.query.t;
  if (auth) {
    const verify = await controller.auth(auth)

    if (verify.auth) {
      return res.sendView('doc.html');
    } else {
      return res.sendView('login.html');
    }
  }
  res.set('x-access-token', auth);
  return res.redirect('/login?status=false');

})

Front.route('/login').get((req: Request, res: Response) => {
  res.sendView('login.html');
});

Front.route('/response').get((req: Request, res: Response) => {
  res.sendView('/response.html');
})


function sendViewMiddleware(req, res, next) {
  res.sendView = function (view) {
    return res.sendFile("/" + view, { root: "public" });
  }
  next();
}

export { Front };
