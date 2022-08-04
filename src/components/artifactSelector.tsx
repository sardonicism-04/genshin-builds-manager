import DeleteForever from "@mui/icons-material/DeleteForever";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { debounce, isEqual, uniqueId } from "lodash";
import React, { useState } from "react";
import constants from "../constants.json";
import artifactData from "../data/artifacts";
import { IArtifact, SlotKey } from "../types/artifact";
import { IBuild } from "../types/build";
import { ArtifactComponent } from "./equipmentComponents";

const { ArtifactSetNames } = constants;

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
  const theme = useTheme();

  // Only artifacts from current slot
  const [open, setOpen] = useState(false);

  const [levelFilter, setLevelFilter] = useState(-1);
  const [filter, setFilter] = useState("");

  // Debounce build label updating to keep UX smooth
  const updateSetFilter = debounce(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFilter(evt.target.value.toLowerCase());
    },
    500
  );

  const artifacts = allArtifacts
    .filter((arti) => arti.slotKey === slot)
    .filter((arti) =>
      ArtifactSetNames[arti.setKey].toLowerCase().includes(filter)
    )
    .filter((arti) => (levelFilter === -1 ? true : arti.level === levelFilter))
    .sort((a, b) => a.setKey.localeCompare(b.setKey));

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
      <Modal
        open={open}
        onClose={() => {
          setFilter("");
          setLevelFilter(-1);
          setOpen(false);
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "75%",
            width: "75%",
            overflow: "scroll",
          }}
        >
          <FormControl
            sx={{
              mx: 1,
              my: 2,
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <InputLabel id="artifact-level-filter">Filter by Level</InputLabel>
            <Select
              fullWidth
              sx={{ height: "56px" }}
              label="Filter by Level"
              labelId="artifact-level-filter"
              value={levelFilter}
              onChange={(evt) => setLevelFilter(evt.target.value as number)}
            >
              <MenuItem value={-1}>No Filter</MenuItem>
              {Array.from({ length: 21 }, (_, i) => 0 + i).map((lvl) => (
                <MenuItem value={lvl} key={lvl}>
                  <ListItemText>{lvl}</ListItemText>
                </MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              label="Filter by Set Name"
              variant="outlined"
              onChange={updateSetFilter}
              sx={{ height: "65px" }}
            />
          </FormControl>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            }}
          >
            <Card sx={{ height: "450px", m: 1 }} variant="outlined">
              <CardActionArea
                sx={{ height: "100%" }}
                onClick={() => {
                  const _artifacts = { ...build.artifacts };
                  delete _artifacts[slot];
                  setBuild({
                    ...build,
                    artifacts: { ..._artifacts },
                  });
                  setFilter("");
                  setLevelFilter(-1);
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
                      ? theme.palette.action.selected
                      : "none",
                  }}
                  variant="outlined"
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
                      setFilter("");
                      setLevelFilter(-1);
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
          </Box>
        </Paper>
      </Modal>
    </>
  );
};
