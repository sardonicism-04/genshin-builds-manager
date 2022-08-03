import DeleteForever from "@mui/icons-material/DeleteForever";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import data from "../constants.json";
import artifactData from "../data/artifacts";
import { IArtifact, SlotKey } from "../types/artifact";
import { IBuild } from "../types/build";
import { artifactID, formatStat, getMainStat } from "../utils/artifactUtil";

const { ArtifactSetNames } = data;

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
        sx={{ height: "65px" }}
        color={build.artifacts?.[slot] ? "primary" : "info"}
      >
        {build.artifacts?.[slot] && (
          <img
            src={
              artifactData[
                artifacts.find(
                  (arti) => artifactID(arti) === build.artifacts[slot]
                )!.setKey
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
            const id = artifactID(arti);
            return (
              <Card
                sx={{
                  height: "450px",
                  m: 1,
                  backgroundColor:
                    build.artifacts?.[slot] === id ? "#515151" : "black",
                }}
                key={id}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() => {
                    setBuild({
                      ...build,
                      artifacts: {
                        ...build.artifacts,
                        [slot]: id,
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
                    <Chip size="small" label={`Lvl ${arti.level}`} />
                    <Typography gutterBottom>
                      <b> {ArtifactSetNames[arti.setKey] ?? "Unknown Set"}</b>
                    </Typography>
                    <Typography>
                      {formatStat(arti.mainStatKey)}:{" "}
                      {getMainStat(arti).toFixed(1)}
                      {arti.mainStatKey.endsWith("_") ? "%" : ""}
                    </Typography>
                    {arti.substats.map((substat) => (
                      <Typography
                        variant="subtitle2"
                        key={`${substat.key}${substat.value}`}
                      >
                        {substat.key ? (
                          `${formatStat(substat.key)}: ${substat.value}`
                        ) : (
                          <br />
                        )}
                      </Typography>
                    ))}
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
