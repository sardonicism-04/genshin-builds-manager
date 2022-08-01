import { ArtifactSetKey, CharacterKey, StatKey } from "./constants";

export interface IArtifact {
  setKey: ArtifactSetKey;
  slotKey: SlotKey;
  level: number;
  rarity: number;
  mainStatKey: StatKey;
  location: CharacterKey | "";
  lock: boolean;
  substats: ISubstat[];
}

export interface ISubstat {
  key: StatKey;
  value: number;
}

export type SlotKey = "flower" | "plume" | "sands" | "goblet" | "circlet";
