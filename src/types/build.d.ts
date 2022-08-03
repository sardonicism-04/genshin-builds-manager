import { IArtifact } from "./artifact";
import { IWeapon } from "./weapon";
import { ICharacter } from "./character";

export interface IBuild {
  label: string;
  character?: ICharacter;
  artifacts: {
    flower?: IArtifact;
    plume?: IArtifact;
    sands?: IArtifact;
    goblet?: IArtifact;
    circlet?: IArtifact;
  };
  weapon?: IWeapon;
}
