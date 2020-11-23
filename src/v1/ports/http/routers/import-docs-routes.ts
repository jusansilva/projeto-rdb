import { Router, Request, Response } from "express";

const ImportDocs = Router();
ImportDocs.route("/v1/import").post(async(req: Request, res: Response) => {
  try {
      return await "to aqui";
  } catch (error) {
      
  }
});


export { ImportDocs };
