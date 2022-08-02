import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
} from "@mui/material";
import React, { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        sx={{ height: "56px" }}
      >
        Select {slot}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "50%",
            width: "50%",
          }}
        >
          {/* TODO: Replace this with a gallery of artifact cards */}
          <FormControl fullWidth>
            <InputLabel id={`artifact-selector-${slot}-label`}>
              {slot[0].toUpperCase()}
              {slot.slice(1)}
            </InputLabel>
            <Select
              labelId={`artifact-selector-${slot}-label`}
              value={build.artifacts?.[slot] ?? ""}
              label={slot[0].toUpperCase() + slot.slice(1)}
              onChange={(evt) => {
                setBuild({
                  ...build,
                  artifacts: {
                    ...build.artifacts,
                    [slot]: evt.target.value,
                  },
                });
              }}
            >
              <MenuItem value="">Leave Slot Empty</MenuItem>
              {artifacts.map((arti) => {
                const id = artifactID(arti);
                return (
                  <MenuItem value={id} key={id}>
                    {id}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Paper>
      </Modal>
    </>
  );
};
