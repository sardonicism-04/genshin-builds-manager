import { CharacterKey } from "./constants";

export interface ICharacter {
  key: CharacterKey;
  level: number;
  constellation: number;
  ascension: number;
  talent: {
    auto: number;
    skill: number;
    burst: number;
  }
}