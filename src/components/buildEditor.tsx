import React, { useState } from "react";
import { Action } from "../App";
import { Store } from "../utils/storage";
import { IBuild } from "../types/build";
import { CharacterKey } from "../types/constants";
import { IGOOD } from "../types/GOOD";
import { ArtifactSelector } from "./artifactSelector";

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
  const [build, setBuild] = useState(
    existingBuild ?? structuredClone(DefaultBuild)
  );
  const buildStorage = new Store("storedBuilds");

  return (
    <div id="build-editor">
      <label htmlFor="build-editor-character">Select Character</label>
      <select
        id="build-editor-character"
        value={existingBuild?.character}
        onChange={(evt) =>
          setBuild({
            ...build,
            character: evt.target.selectedOptions[0].value as CharacterKey,
          })
        }
      >
        <option value="">Select a character</option>
        {database.characters!.map((char) => (
          <option value={char.key} key={char.key}>
            {char.key}
          </option>
        ))}
      </select>

      <label htmlFor="build-editor-name">Build Name</label>
      <input
        id="build-editor-name"
        placeholder="New build"
        value={existingBuild?.label}
        onChange={(evt) => setBuild({ ...build, label: evt.target.value })}
      />

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

      <button
        onClick={(evt) => {
          let buildValidated = false;
          if (!build?.character) {
            console.error("Missing character selection");
          } else if (!build?.label) {
            console.error("Missing build label");
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
      </button>
      <button onClick={() => setAction(Action.None)}>Cancel</button>
    </div>
  );
};
