import React from "react";
import { IArtifact, SlotKey } from "../types/artifact";
import { IBuild } from "../types/build";
import { artifactID } from "../utils/artifactID";

interface IProps {
  allArtifacts: IArtifact[];
  slot: SlotKey;
  build: IBuild;
  setBuild: (build: IBuild) => void;
}

export const ArtifactSelector = ({
  allArtifacts,
  slot,
  build,
  setBuild,
}: IProps): React.ReactElement => {
  const artifacts = allArtifacts.filter((arti) => arti.slotKey === slot);

  return (
    <label
      className="artifactSelectorDropdown"
      id={`artifact-selector-${slot}`}
      style={{ display: "block" }}
    >
      Select {slot[0].toUpperCase()}
      {slot.slice(1)}
      <select
        value={build.artifacts?.[slot]}
        onChange={(evt) => {
          setBuild({
            ...build,
            artifacts: {
              ...build.artifacts,
              [slot]: evt.target.selectedOptions[0].value,
            },
          });
        }}
      >
        <option value={0}>Leave Slot Empty</option>
        {artifacts.map((arti) => {
          const id = artifactID(arti);
          return (
            <option value={id} key={id}>
              {id}
            </option>
          );
        })}
      </select>
    </label>
  );
};
