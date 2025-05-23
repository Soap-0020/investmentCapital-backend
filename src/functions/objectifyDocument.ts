import { Document } from "mongoose";

const objectifyDocument = (document: Document<any>): any => {
  document = document.toObject();
  delete document._id;
  // @ts-ignore
  delete document.__v;
  return document;
};

export default objectifyDocument;
