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
            height: "75%",
            width: "75%",

            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            overflow: "scroll",
          }}
        >
          {artifacts.map((arti) => {
            const id = artifactID(arti);
            return (
              <Card
                sx={{
                  height: "440px",
                  m: 1,
                  // maxWidth: "320px",
                  backgroundColor:
                    build.artifacts?.[slot] === id ? "#515151" : "black",
                }}
                key={id}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() =>
                    setBuild({
                      ...build,
                      artifacts: {
                        ...build.artifacts,
                        [slot]: id,
                      },
                    })
                  }
                >
                  <CardMedia
                    component="img"
                    height="256"
                    image={artifactData?.[arti.setKey]?.[arti.slotKey]}
                    alt="le artifact"
                  />
                  <CardContent>
                    <Typography>
                      <Chip size="small" label={`Lvl ${arti.level}`} />
                      <b> {ArtifactSetNames[arti.setKey] ?? "Unknown Set"}</b>
                      <br />
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
