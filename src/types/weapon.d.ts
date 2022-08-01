import { CharacterKey, WeaponKey } from "./constants";

export interface IWeapon {
  key: WeaponKey;
  level: number;
  ascension: number;
  refinement: number;
  location: CharacterKey | "";
  lock: boolean;
}
