import { MODES } from "../constants";

export type ModeType = keyof typeof MODES;

export interface ITags {
  [key: string]: number;
}