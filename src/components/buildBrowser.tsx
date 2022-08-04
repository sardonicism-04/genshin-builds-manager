import Clear from "@mui/icons-material/Clear";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { debounce, uniqueId } from "lodash";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Action } from "../App";
import artifacts from "../data/artifacts";
import characters from "../data/characters";
import weapons from "../data/weapons";
import { IArtifact } from "../types/artifact";
import { IBuild } from "../types/build";
import { IGOOD } from "../types/GOOD";
import { sanitizeStoreKey, Store } from "../utils/storage";
import { ConfirmationDialog } from "./confirmationDialog";
import {
  ArtifactComponent,
  CharacterComponent,
  WeaponComponent
} from "./equipmentComponents";
import { StatsTable } from "./statsTable";

const getBuildArtifacts = (build: IBuild): (IArtifact | null)[] => {
  let artifacts: (IArtifact | null)[] = [];
  for (const slot of ["flower", "plume", "sands", "goblet", "circlet"]) {
    artifacts.push(build.artifacts[slot] ?? null);
  }
  return artifacts;
};

interface IProps {
  database: IGOOD;
  setAction: (action: Action) => void;
  setBuild: (build: IBuild) => void;
  rerender: () => void;
}

export const BuildBrowser = ({
  database,
  setAction,
  setBuild,
  rerender,
}: IProps): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();

  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<IBuild | null>(null);

  const buildStorage = new Store("storedBuilds");
  const databaseLoaded = Object.keys(database).length !== 0;

  const [filter, setFilter] = useState("");
  const updateBuildFilter = debounce(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFilter(evt.target.value.toLowerCase());
    },
    250
  );

  const builds: IBuild[] = [...buildStorage.values()]
    .map((b) => JSON.parse(b))
    .filter((build) => build.label.toLowerCase().includes(filter));

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
        <Stack
          direction="row"
          spacing={2}
          sx={{ position: "sticky", top: 0, zIndex: 1000, p: 1 }}
          component={Paper}
          elevation={10}
        >
          <Button
            fullWidth
            onClick={() => setAction(Action.Create)}
            disabled={!databaseLoaded}
          >
            Create new build
          </Button>
          <TextField
            fullWidth
            label="Filter by Build Name"
            variant="outlined"
            onChange={updateBuildFilter}
            disabled={!databaseLoaded}
          />
        </Stack>
        {databaseLoaded ? (
          builds.map((build) => {
            const buildArtis = getBuildArtifacts(build);
            return (
              <Card raised sx={{ my: 1 }} key={uniqueId()}>
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Typography variant="h5">{build.label}</Typography>
                    <Button
                      onClick={() => {
                        // Trigger the build editor
                        setBuild(build);
                        setAction(Action.Edit);
                      }}
                      startIcon={<Edit />}
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => {
                        // Trigger the deletion confirmation dialog
                        setPendingDeletion(build);
                        setDeletionDialogOpen(true);
                      }}
                      startIcon={<DeleteForever />}
                      color="error"
                    >
                      Delete
                    </Button>

                    <Button
                      onClick={() => {
                        const sKey = sanitizeStoreKey(build.label);
                        // Find a number to add to the key
                        const numCopies = [...buildStorage.keys()].filter(
                          (key) => new RegExp(`${sKey}copy\\d`).exec(key)
                        ).length;

                        // Make a clone of the build data, with the label indicating it's
                        // a copy
                        buildStorage.setItem(
                          `${sKey}copy${numCopies}`,
                          JSON.stringify(
                            structuredClone({
                              ...build,
                              label: `${build.label} Copy ${numCopies}`,
                            })
                          )
                        );
                        // Rerender so the changes are visible
                        rerender();
                        enqueueSnackbar(`Duplicated build "${build.label}"`);
                      }}
                      startIcon={<ContentCopy />}
                      color="info"
                    >
                      Duplicate
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
                              title={<ArtifactComponent artifact={artifact} />}
                              key={uniqueId()}
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
            // Delete the build
            buildStorage.deleteItem(sanitizeStoreKey(pendingDeletion.label));
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
