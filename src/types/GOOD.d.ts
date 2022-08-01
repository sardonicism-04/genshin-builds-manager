import { IArtifact } from "./artifact";
import { ICharacter } from "./character";
import { IWeapon } from "./weapon";

export interface IGOOD {
  format: "GOOD";
  version: number;
  source: string;
  characters?: ICharacter[];
  artifacts?: IArtifact[];
  weapons?: IWeapon[];
  materials?: {
    // Materials are not relevant data for this
    [key: string]: number;
  };
}
