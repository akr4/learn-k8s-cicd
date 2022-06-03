import {DotenvParseOutput, parse} from "dotenv";
import * as fs from "fs";

export const loadValuesFile = <T extends DotenvParseOutput> (): T => {
  const path = process.env.VALUES_FILE;
  if (path == null) {
    throw new Error('no VALUES_FILE environment variable found.');
  }
  return load(path);
}

export const loadSecretsFile = <T extends DotenvParseOutput> (): T => {
  const path = process.env.SECRETS_FILE;
  if (path == null) {
    throw new Error('no SECRETS_FILE environment variable found.');
  }
  return load(path);
}

const load = <T extends DotenvParseOutput>(path: string): T => {
  const data = fs.readFileSync(path);
  return parse(data) as T;
};
