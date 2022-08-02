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
  MenuItem,
  Select,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Ganyu } from "../data/characters/Ganyu";
import { IArtifact } from "../types/artifact";
import { artifactID } from "../utils/artifactID";

interface IProps {
  database: IGOOD;
  existingBuild?: IBuild;
  setAction: (action: Action) => void;
}

const DefaultBuild: IBuild = {
  label: "",
  artifacts: {},
};

const getStatSum = (artifacts: IArtifact[], stat: StatKey): number => {
  const allStats = artifacts
    .map((arti) => [
      /* TODO: main stats */ ...arti.substats
        .filter((substat) => substat.key === stat)
        .map((substat) => substat.value),
    ])
    .flat(2);
  let total = 0;
  allStats.forEach((val) => (total += val));
  return total;
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

  return (
    <Stack spacing={2}>
      <TextField
        label="Build Name"
        variant="outlined"
        onChange={(evt) => setBuild({ ...build, label: evt.target.value })}
        value={existingBuild?.label}
      />

      <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel id="build-editor-character-label">
            Select Character
          </InputLabel>
          <Select
            labelId="build-editor-character-label"
            value={build?.character ?? ""}
            label="Select Character"
            onChange={(evt) =>
              setBuild({
                ...build,
                character: evt.target.value as CharacterKey,
              })
            }
          >
            <MenuItem value="">Select a character</MenuItem>
            {database.characters!.map((char) => (
              <MenuItem value={char.key} key={char.key}>
                <img src={Ganyu} alt="a" height="16px" width="16px" />{" "}
                {char.key}
              </MenuItem>
            ))}
          </Select>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CRIT Rate</TableCell>
                <TableCell>+{getStatSum(artifacts, "critRate_")}%</TableCell>
                <TableCell>ATK</TableCell>
                {/* TODO: Calculate in ATK% stats */}
                <TableCell>+{getStatSum(artifacts, "atk")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CRIT Dmg</TableCell>
                <TableCell>+{getStatSum(artifacts, "critDMG_")}%</TableCell>
                <TableCell>HP</TableCell>
                {/* TODO: Calculate in HP% stats */}
                <TableCell>+{getStatSum(artifacts, "hp")}</TableCell>
              </TableRow>
              <TableRow>
                {/* TODO: Calculate in DEF% stats */}
                <TableCell>DEF</TableCell>
                <TableCell>+{getStatSum(artifacts, "def")}</TableCell>
                <TableCell>EM</TableCell>
                <TableCell>+{getStatSum(artifacts, "eleMas")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ER</TableCell>
                <TableCell>+{getStatSum(artifacts, "enerRech_")}%</TableCell>
                <TableCell>Healing Bonus</TableCell>
                <TableCell>+{getStatSum(artifacts, "heal_")}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Elemental Bonus</TableCell>
                {/* TODO: Add in all the various special goblet stats */}
                <TableCell>+%</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </FormControl>

        <Stack spacing={2} sx={{ width: "100%" }}>
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
