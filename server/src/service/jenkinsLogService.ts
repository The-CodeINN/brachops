import { jenkins } from "$/utils/jenkinsClient";
import { Readable } from "stream";

export interface LogOptions {
  name: string;
  number: number;
  start?: number;
  type?: "text" | "html";
  meta?: boolean;
}

export interface StreamOptions {
  name: string;
  number: number;
  type?: "text" | "html";
  delay?: number;
}

export const getBuildLog = async (options: LogOptions) => {
  const { name, number, start, type, meta } = options;
  return await jenkins.build.log(name, number, start, type, meta);
};

export const getBuildLogStream = async (options: StreamOptions): Promise<Readable> => {
  const { name, number, type, delay } = options;
  const stream = await jenkins.build.logStream(name, number, type, delay);
  return stream as Readable;
};
