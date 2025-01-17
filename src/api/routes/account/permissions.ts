import Route from "../../../types/route";
import Investor from "../../../types/investor";
import { Response } from "express";

export default {
  path: "/account/permissions",
  authorized: true,
  method: "get",
  execute: (_, investor: Investor, __, res: Response) =>
    res.json(investor.permissions),
} satisfies Route;
