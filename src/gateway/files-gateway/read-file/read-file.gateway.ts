import fs, { ObjectEncodingOptions } from "fs";
import path from "path";

import { Nullable } from "frontent/models";

export type ReadFileGatewayOpts = Nullable<
  | (
      | (ObjectEncodingOptions & {
          flag?: string | undefined;
        })
      | BufferEncoding
    )
  | (
      | {
          encoding: BufferEncoding;
          flag?: string | undefined;
        }
      | BufferEncoding
    )
  | {
      encoding?: null | undefined;
      flag?: string | undefined;
    }
>;

export type ReadFileGatewayOutput = string | Buffer;

export type ReadFileGatewayArgs = {
  filePath: string;
  opts?: ReadFileGatewayOpts;
};

export const readFileGateway = (args: ReadFileGatewayArgs): Promise<ReadFileGatewayOutput> => {
  const { filePath, opts = "utf-8" } = args;

  return new Promise<ReadFileGatewayOutput>((resolve, reject) => {
    fs.readFile(path.resolve(filePath), opts, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
