import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { uniqueId } from "lodash";
import React from "react";
import constants from "../constants.json";
import characters from "../data/characters";
import weaponData from "../data/weapons";
import { IArtifact } from "../types/artifact";
import { ICharacter } from "../types/character";
import { StatKey } from "../types/constants";
import { IWeapon } from "../types/weapon";
import { formatStat, getMainStat } from "../utils/artifactUtil";
import { getWeaponBaseAtk, getWeaponSubstat } from "../utils/weaponUtil";

const { ArtifactSetNames } = constants;

interface IArtifactProps {
  artifact: IArtifact;
}

export const ArtifactComponent = ({
  artifact,
}: IArtifactProps): React.ReactElement => {
  return (
    <>
      <Chip size="small" label={`Lvl ${artifact.level}`} />
      <Chip size="small" label={"⭐ ".repeat(artifact.rarity)} sx={{ ml: 1 }} />
      <Typography gutterBottom>
        <b> {ArtifactSetNames[artifact.setKey] ?? "Unknown Set"}</b>
      </Typography>
      <Typography>
        {formatStat(artifact.mainStatKey)}: {getMainStat(artifact).toFixed(1)}
        {artifact.mainStatKey.endsWith("_") ? "%" : ""}
      </Typography>
      {artifact.substats.map((substat) => (
        <Typography variant="subtitle2" key={uniqueId()}>
          {substat.key ? (
            `${formatStat(substat.key)}: ${substat.value}`
          ) : (
            <br />
          )}
        </Typography>
      ))}
    </>
  );
};

interface IWeaponProps {
  weapon: IWeapon;
}

export const WeaponComponent = ({
  weapon,
}: IWeaponProps): React.ReactElement => {
  const _weapon = weaponData[weapon.key as keyof typeof weaponData];

  const substat = Object.keys(_weapon.data.stats).find(
    (stat) => stat !== "base_atk"
  );
  let statVal = 0;
  if (substat) {
    statVal = getWeaponSubstat(weapon, substat as StatKey)!;
  }

  return (
    <>
      <Chip size="small" label={`Lvl ${weapon.level} R${weapon.refinement}`} />
      <Typography gutterBottom>
        <b> {_weapon.data.name ?? "Unknown Set"}</b>
      </Typography>
      <Typography>Base ATK: {getWeaponBaseAtk(weapon).toFixed(0)}</Typography>
      {substat && (
        <Typography variant="subtitle2">
          {formatStat(substat)}:{" "}
          {(statVal < 1 ? statVal * 100 : statVal).toFixed(1)}
        </Typography>
      )}
    </>
  );
};

interface ICharacterProps {
  character: ICharacter;
}

export const CharacterComponent = ({
  character,
}: ICharacterProps): React.ReactElement => {
  return (
    <>
      <Chip
        size="small"
        label={`Lvl ${character.level} Asc ${character.ascension} C${character.constellation}`}
      />
      <Typography>
        <b>{characters[character.key].data.name}</b>
      </Typography>
    </>
  );
};
