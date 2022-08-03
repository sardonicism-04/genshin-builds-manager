import Clear from "@mui/icons-material/Clear";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { uniqueId } from "lodash";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Action } from "../App";
import artifacts from "../data/artifacts";
import characters from "../data/characters";
import weapons from "../data/weapons";
import { IArtifact } from "../types/artifact";
import { IBuild } from "../types/build";
import { IGOOD } from "../types/GOOD";
import { Store } from "../utils/storage";
import { ConfirmationDialog } from "./confirmationDialog";
import {
  ArtifactComponent,
  CharacterComponent,
  WeaponComponent,
} from "./equipmentComponents";
import { StatsTable } from "./statsTable";

interface IProps {
  database: IGOOD;
  setAction: (action: Action) => void;
  setBuild: (build: IBuild) => void;
}

const getBuildArtifacts = (build: IBuild): (IArtifact | null)[] => {
  let artifacts: (IArtifact | null)[] = [];
  for (const slot of ["flower", "plume", "sands", "goblet", "circlet"]) {
    artifacts.push(build.artifacts[slot] ?? null);
  }
  return artifacts;
};

export const BuildBrowser = ({
  database,
  setAction,
  setBuild,
}: IProps): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();

  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<IBuild | null>(null);

  const buildStorage = new Store("storedBuilds");
  const databaseLoaded = Object.keys(database).length !== 0;

  return (
    <>
      <Paper
        sx={{
          overflowY: "scroll",
          height: databaseLoaded ? "75%" : "fit-content",
          textAlign: "center",
          p: 2,
        }}
      >
        <Button
          fullWidth
          onClick={() => setAction(Action.Create)}
          disabled={!databaseLoaded}
          sx={{ position: "sticky", top: 0, zIndex: 1000 }}
        >
          Create new build
        </Button>
        {databaseLoaded ? (
          [...buildStorage.values()].map((_build) => {
            const build = JSON.parse(_build) as IBuild;
            const buildArtis = getBuildArtifacts(build);
            return (
              <Card raised sx={{ my: 1 }} key={uniqueId()}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="h5">{build.label}</Typography>
                    <Button
                      onClick={() => {
                        setBuild(build);
                        setAction(Action.Edit);
                      }}
                      startIcon={<Edit />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setPendingDeletion(build);
                        setDeletionDialogOpen(true);
                      }}
                      startIcon={<DeleteForever />}
                      color="error"
                    >
                      Delete
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <StatsTable
                      database={database}
                      build={build}
                      artifacts={buildArtis.filter((a) => a) as IArtifact[]}
                    />
                    <Box
                      component={Paper}
                      display="flex"
                      sx={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Tooltip
                        title={
                          <CharacterComponent character={build.character!} />
                        }
                      >
                        <img
                          src={characters[build.character!.key]?.avatar}
                          alt="Build Character"
                          width="180px"
                          height="180px"
                        />
                      </Tooltip>
                      <Stack direction="row" spacing={2}>
                        {build.weapon ? (
                          <Tooltip
                            title={<WeaponComponent weapon={build.weapon} />}
                          >
                            <img
                              src={weapons[build.weapon!.key]?.icon}
                              alt="Build Weapon"
                              width="48px"
                              height="48px"
                            />
                          </Tooltip>
                        ) : (
                          <Clear sx={{ fontSize: "48px" }} />
                        )}
                        {buildArtis.map((artifact) =>
                          artifact ? (
                            <Tooltip
                              title={
                                <ArtifactComponent
                                  artifact={artifact}
                                  key={uniqueId()}
                                />
                              }
                            >
                              <img
                                src={
                                  artifacts[artifact.setKey][artifact.slotKey]
                                }
                                alt="Build Artifact"
                                width="48px"
                                height="48px"
                              />
                            </Tooltip>
                          ) : (
                            <Clear sx={{ fontSize: "48px" }} key={uniqueId()} />
                          )
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography sx={{ mt: 1 }} variant="h6">
            You need to load a database to manage builds!
          </Typography>
        )}
      </Paper>
      {pendingDeletion && (
        <ConfirmationDialog
          title="Delete Build?"
          content={
            <>
              The <b>{pendingDeletion.label}</b> build will be permanently
              deleted.
            </>
          }
          open={deletionDialogOpen}
          setOpen={setDeletionDialogOpen}
          onConfirm={() => {
            buildStorage.deleteItem(pendingDeletion.label.replace(/\s/g, "_"));
            enqueueSnackbar(
              `Build "${pendingDeletion.label}" has been deleted`
            );
            setPendingDeletion(null);
          }}
          onCancel={() => setPendingDeletion(null)}
        />
      )}
    </>
  );
};
