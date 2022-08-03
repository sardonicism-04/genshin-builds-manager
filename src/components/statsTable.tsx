import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { IArtifact } from "../types/artifact";
import { IBuild } from "../types/build";
import { ICharacter } from "../types/character";
import { StatKey } from "../types/constants";
import { IGOOD } from "../types/GOOD";
import { IWeapon } from "../types/weapon";
import { getMainStat } from "../utils/artifactUtil";
import { getCharacterBaseStats } from "../utils/characterUtil";
import { getWeaponSubstat } from "../utils/weaponUtil";

const getStatSum = (
  artifacts: IArtifact[],
  stat: StatKey,
  character?: ICharacter,
  weapon?: IWeapon
): number => {
  // Get all of the main stats / substats of the given artifacts
  // except those that map to HP%, ATK%, or DEF% (which are calculated elsewhere)
  const allStats = artifacts
    .map((arti) => [
      arti.mainStatKey === stat &&
      !["hp_", "atk_", "def_"].includes(arti.mainStatKey)
        ? getMainStat(arti)
        : 0,
      ...arti.substats
        .filter((substat) => substat.key === stat)
        .map((substat) => substat.value),
    ])
    .flat(2);
  let total = 0;
  allStats.forEach((val) => (total += val));

  // If a weapon was passed, add its substat value into the total
  if (weapon && character) {
    const weaponStat = getWeaponSubstat(weapon, stat) ?? 0;
    total += weaponStat < 1 ? weaponStat * 100 : weaponStat;
  }

  return total;
};

const getBonusFromPercent = (
  artifacts: IArtifact[],
  stat: "hp_" | "atk_" | "def_",
  character?: ICharacter,
  weapon?: IWeapon
): number => {
  const base = getCharacterBaseStats(character, weapon);
  let totalPercent = 0;
  // Get the sum of the stats which influence one of
  // HP%, ATK%, or DEF%
  const allPercentStats = artifacts
    .map((arti) => [
      arti.mainStatKey === stat ? getMainStat(arti) : 0,
      ...arti.substats
        .filter((substat) => substat.key === stat)
        .map((substat) => substat.value),
    ])
    .flat(2);

  allPercentStats.forEach((val) => (totalPercent += val));

  // If the weapon influences a relevant stat, add its value to the multiplier
  if (weapon && character) {
    const weaponStat = getWeaponSubstat(weapon, stat) ?? 0;
    totalPercent += weaponStat * 100;
  }

  // Multiply the total percentage by the base stat of the character
  return (totalPercent / 100) * (base[stat.replace(/(atk|hp)_/g, "$1")] ?? 1);
};

interface IProps {
  database: IGOOD;
  build: IBuild;
  artifacts: IArtifact[];
}

export const StatsTable = ({
  database,
  build,
  artifacts,
}: IProps): React.ReactElement => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>CRIT Rate</TableCell>
          <TableCell>
            +
            {getStatSum(
              artifacts,
              "critRate_",
              build.character,
              build.weapon
            ).toFixed(1)}
            %
          </TableCell>
          <TableCell>ATK</TableCell>
          <TableCell>
            +
            {(
              getStatSum(artifacts, "atk") +
              getBonusFromPercent(
                artifacts,
                "atk_",
                build.character,
                build.weapon
              )
            ).toFixed(0)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>CRIT Dmg</TableCell>
          <TableCell>
            +
            {getStatSum(
              artifacts,
              "critDMG_",
              build.character,
              build.weapon
            ).toFixed(1)}
            %
          </TableCell>
          <TableCell>HP</TableCell>
          <TableCell>
            +
            {(
              getStatSum(artifacts, "hp", build.character, build.weapon) +
              getBonusFromPercent(
                artifacts,
                "hp_",
                build.character,
                build.weapon
              )
            ).toFixed(0)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>DEF</TableCell>
          <TableCell>
            +
            {(
              getStatSum(artifacts, "def") +
              getBonusFromPercent(
                artifacts,
                "def_",
                build.character,
                build.weapon
              )
            ).toFixed(0)}
          </TableCell>
          <TableCell>EM</TableCell>
          <TableCell>
            +
            {getStatSum(
              artifacts,
              "eleMas",
              build.character,
              build.weapon
            ).toFixed(0)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>ER</TableCell>
          <TableCell>
            +
            {getStatSum(
              artifacts,
              "enerRech_",
              build.character,
              build.weapon
            ).toFixed(1)}
            %
          </TableCell>
          <TableCell>Healing Bonus</TableCell>
          <TableCell>
            +
            {getStatSum(
              artifacts,
              "heal_",
              build.character,
              build.weapon
            ).toFixed(1)}
            %
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Elemental Bonus</TableCell>
          <TableCell>
            +
            {[
              "physical_dmg_",
              "anemo_dmg_",
              "geo_dmg_",
              "electro_dmg_",
              "hydro_dmg_",
              "pyro_dmg_",
              "cryo_dmg_",
              "dendro_dmg_",
            ]
              .map((stat) =>
                getStatSum(
                  artifacts,
                  stat as StatKey,
                  build.character,
                  build.weapon
                )
              )
              .find((val) => val !== 0)
              ?.toFixed(1) ?? 0}
            %
          </TableCell>
        </TableRow>
      </TableHead>
    </Table>
  );
};
