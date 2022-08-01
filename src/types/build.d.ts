import { CharacterKey } from "./constants";
import { IWeapon } from "./weapon";

export interface IBuild {
  label: string;
  character?: CharacterKey;
  artifacts: {
    flower?: string;
    plume?: string;
    sands?: string;
    goblet?: string;
    circlet?: string;
  };
  weapon?: IWeapon;
}
