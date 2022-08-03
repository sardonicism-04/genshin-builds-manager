import React, { useState } from "react";
import { Action } from "../App";
import { IBuild } from "../types/build";
import { CharacterKey } from "../types/constants";
import { IGOOD } from "../types/GOOD";
import { sanitizeStoreKey, Store } from "../utils/storage";
import { ArtifactSelector } from "./artifactSelector";

import Info from "@mui/icons-material/Info";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { debounce } from "lodash";
import { useSnackbar } from "notistack";
import characters from "../data/characters";
import weapons from "../data/weapons";
import { IWeapon } from "../types/weapon";
import { StatsTable } from "./statsTable";
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

  const artifacts = Object.values(build.artifacts);

  let weaponsAvailable: IWeapon[] = [];
  if (build.character) {
    // Get character's relevant weapon type
    const weaponType = characters[build.character.key].data.weapon_type;
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

  // Debounce build label updating to keep UX smooth
  const updateBuildLabel = debounce((evt) => {
    setBuild({ ...build, label: evt.target.value });
  }, 500);

  return (
    <Stack component={Paper} spacing={2} sx={{ p: 2 }}>
      <TextField
        label="Build Name"
        variant="outlined"
        onChange={updateBuildLabel}
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
                value={build.character?.key ?? ""}
                label="Select Character"
                onChange={(evt) =>
                  setBuild({
                    ...build,
                    character: database.characters?.find(
                      (char) => char.key === (evt.target.value as CharacterKey)
                    ),
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
          <StatsTable database={database} artifacts={artifacts} build={build} />
          <Tooltip
            title={
              <Typography>
                Stats are currently calculated based <b>only</b> on your
                weapon's <i>Base ATK</i>, <i>substat</i>,{" "}
                <i>artifact main stats</i>, and <i>artifact substats</i>.
                Bonuses from 2- and 4-piece artifact sets are currently{" "}
                <i>not</i> included in calculations.
              </Typography>
            }
          >
            <Typography
              variant="subtitle2"
              color="primary"
              fontStyle="italic"
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                width: "fit-content",
              }}
            >
              Why do my stats look wrong?{" "}
              <Info sx={{ ml: 1 }} fontSize="small" />
            </Typography>
          </Tooltip>
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
                sanitizeStoreKey(build.label),
                JSON.stringify(build)
              );

              // Delete the original copy from storage if it was renamed
              if (existingBuild && existingBuild.label !== build.label) {
                buildStorage.deleteItem(sanitizeStoreKey(existingBuild.label));
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
