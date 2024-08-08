import DataUriParser from "datauri/parser.js";
import { DataURI } from "datauri/types";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file: { originalname: string; buffer: DataURI.Input; }) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
export default getDataUri;