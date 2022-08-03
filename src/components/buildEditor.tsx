import React, { useState } from "react";
import { Action } from "../App";
import { IBuild } from "../types/build";
import { CharacterKey, StatKey } from "../types/constants";
import { IGOOD } from "../types/GOOD";
import { Store } from "../utils/storage";
import { ArtifactSelector } from "./artifactSelector";

import {
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import { useSnackbar } from "notistack";
import characters from "../data/characters";
import weapons from "../data/weapons";
import { IArtifact } from "../types/artifact";
import { ICharacter } from "../types/character";
import { IWeapon } from "../types/weapon";
import { artifactID, getMainStat } from "../utils/artifactUtil";
import { getCharacter, getCharacterBaseStats } from "../utils/characterUtil";
import { getWeaponSubstat } from "../utils/weaponUtil";
import { WeaponSelector } from "./weaponSelector";

interface IProps {
  database: IGOOD;
  existingBuild?: IBuild;
  setAction: (action: Action) => void;
}

const DefaultBuild: IBuild = {
  label: "",
  artifacts: {},
};

const getStatSum = (
  artifacts: IArtifact[],
  stat: StatKey,
  character?: ICharacter,
  weapon?: IWeapon
): number => {
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
  const allPercentStats = artifacts
    .map((arti) => [
      arti.mainStatKey === stat ? getMainStat(arti) : 0,
      ...arti.substats
        .filter((substat) => substat.key === stat)
        .map((substat) => substat.value),
    ])
    .flat(2);

  allPercentStats.forEach((val) => (totalPercent += val));

  if (weapon && character) {
    const weaponStat = getWeaponSubstat(weapon, stat) ?? 0;
    totalPercent += weaponStat * 100;
  }

  return (totalPercent / 100) * (base[stat.replace(/(atk|hp)_/g, "$1")] ?? 1);
};

export const BuildEditor = ({
  database,
  existingBuild,
  setAction,
}: IProps): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();
  const [build, setBuild] = useState(
    existingBuild ?? structuredClone(DefaultBuild)
  );
  const buildStorage = new Store("storedBuilds");

  const artifacts = database.artifacts!.filter((arti) =>
    Object.values(build.artifacts).includes(artifactID(arti))
  );

  let weaponsAvailable: IWeapon[] = [];
  if (build.character) {
    // Get character's relevant weapon type
    const weaponType = characters[build.character].data.weapon_type;
    const matchingWeapons = Object.entries(weapons)
      .filter(([_, w]) => w.data.type === weaponType)
      .map(([k, w]) => k);
    // Filter weapons in database such that only weapons usable by
    // the character are shown
    for (const weapon of database.weapons ?? []) {
      if (matchingWeapons.includes(weapon.key)) {
        weaponsAvailable.push(weapon);
      }
    }
  }

  return (
    <Stack component={Paper} spacing={2} sx={{ p: 2 }}>
      <TextField
        label="Build Name"
        variant="outlined"
        onChange={(evt) => setBuild({ ...build, label: evt.target.value })}
        defaultValue={existingBuild?.label}
        sx={{ height: "65px" }}
      />

      <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
        <FormControl fullWidth>
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <span style={{ width: "100%" }}>
              <InputLabel id="build-editor-character-label">
                Select Character
              </InputLabel>
              <Select
                fullWidth
                labelId="build-editor-character-label"
                value={build?.character ?? ""}
                label="Select Character"
                onChange={(evt) =>
                  setBuild({
                    ...build,
                    character: evt.target.value as CharacterKey,
                  })
                }
                sx={{ height: "65px" }}
              >
                <MenuItem value="">Select a character</MenuItem>
                {database.characters!.map((char) => (
                  <MenuItem value={char.key} key={char.key}>
                    <Stack direction="row" alignItems="center">
                      <img
                        src={characters[char.key].avatar}
                        alt={char.key}
                        height="32px"
                        width="32px"
                        style={{ marginRight: 8 }}
                      />
                      <ListItemText>
                        {characters[char.key].data.name}
                      </ListItemText>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </span>
            <WeaponSelector
              weapons={weaponsAvailable}
              build={build}
              setBuild={setBuild}
            ></WeaponSelector>
          </Stack>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CRIT Rate</TableCell>
                <TableCell>
                  +
                  {getStatSum(
                    artifacts,
                    "critRate_",
                    getCharacter(database, build.character),
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
                      database.characters?.find(
                        (char) => char.key === build.character
                      ),
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
                    getCharacter(database, build.character),
                    build.weapon
                  ).toFixed(1)}
                  %
                </TableCell>
                <TableCell>HP</TableCell>
                <TableCell>
                  +
                  {(
                    getStatSum(
                      artifacts,
                      "hp",
                      getCharacter(database, build.character),
                      build.weapon
                    ) +
                    getBonusFromPercent(
                      artifacts,
                      "hp_",
                      getCharacter(database, build.character),
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
                      getCharacter(database, build.character),
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
                    getCharacter(database, build.character),
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
                    getCharacter(database, build.character),
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
                    getCharacter(database, build.character),
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
                        getCharacter(database, build.character),
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
        </FormControl>

        <Stack spacing={2} sx={{ width: "50%" }}>
          <ArtifactSelector
            allArtifacts={database.artifacts!}
            slot="flower"
            build={build}
            setBuild={setBuild}
          />
          <ArtifactSelector
            allArtifacts={database.artifacts!}
            slot="plume"
            build={build}
            setBuild={setBuild}
          />
          <ArtifactSelector
            allArtifacts={database.artifacts!}
            slot="sands"
            build={build}
            setBuild={setBuild}
          />
          <ArtifactSelector
            allArtifacts={database.artifacts!}
            slot="goblet"
            build={build}
            setBuild={setBuild}
          />
          <ArtifactSelector
            allArtifacts={database.artifacts!}
            slot="circlet"
            build={build}
            setBuild={setBuild}
          />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          onClick={(evt) => {
            let buildValidated = false;
            if (!build?.character) {
              enqueueSnackbar("Missing character selection", {
                variant: "error",
              });
            } else if (!build?.label) {
              enqueueSnackbar("Missing build name", { variant: "error" });
            } else {
              buildValidated = true;
            }

            if (buildValidated) {
              buildStorage.setItem(
                build.label.replace(/\s/g, "_"),
                JSON.stringify(build)
              );

              // Delete the original copy from storage if it was renamed
              if (existingBuild && existingBuild.label !== build.label) {
                buildStorage.deleteItem(
                  existingBuild.label.replace(/\s/g, "_")
                );
              }

              setAction(Action.None);
            }
          }}
        >
          Save Build
        </Button>
        <Button fullWidth color="error" onClick={() => setAction(Action.None)}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
