import DeleteForever from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { isEqual, uniqueId } from "lodash";
import React, { useState } from "react";
import artifactData from "../data/artifacts";
import { IArtifact, SlotKey } from "../types/artifact";
import { IBuild } from "../types/build";
import { ArtifactComponent } from "./equipmentComponents";

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
  // Only artifacts from current slot
  const artifacts = allArtifacts.filter((arti) => arti.slotKey === slot);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        sx={{ height: "65px" }}
        color={build.artifacts?.[slot] ? "primary" : "info"}
      >
        {build.artifacts?.[slot] && (
          <img
            src={
              // Find the artifact whose object is an exact copy of
              // the one in the build
              artifactData[
                artifacts.find((arti) => isEqual(arti, build.artifacts[slot]))!
                  .setKey
              ][slot]
            }
            height="32px"
            width="32px"
            alt="Artifact Icon"
            style={{ marginRight: 8 }}
          />
        )}
        {build.artifacts?.[slot] ? "Change" : "Select"} {slot}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "75%",
            width: "75%",

            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            overflow: "scroll",
          }}
        >
          <Card sx={{ height: "450px", m: 1 }}>
            <CardActionArea
              sx={{ height: "100%" }}
              onClick={() => {
                setBuild({
                  ...build,
                  artifacts: { ...build.artifacts, [slot]: null },
                });
                setOpen(false);
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <DeleteForever sx={{ fontSize: 256 }} />
                <Typography>Clear Slot</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          {artifacts.map((arti) => {
            return (
              <Card
                sx={{
                  height: "450px",
                  m: 1,
                  backgroundColor: isEqual(arti, build.artifacts?.[slot])
                    ? "#515151"
                    : "black",
                }}
                key={uniqueId()}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  // When the artifact is clicked, change the slotted value
                  onClick={() => {
                    setBuild({
                      ...build,
                      artifacts: {
                        ...build.artifacts,
                        [slot]: arti,
                      },
                    });
                    setOpen(false);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="256"
                    image={artifactData?.[arti.setKey]?.[arti.slotKey]}
                    alt="le artifact"
                  />
                  <CardContent>
                    <ArtifactComponent artifact={arti} />
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Paper>
      </Modal>
    </>
  );
};
