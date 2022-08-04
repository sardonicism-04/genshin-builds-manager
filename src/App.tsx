import GitHub from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { BuildBrowser } from "./components/buildBrowser";
import { BuildEditor } from "./components/buildEditor";
import { IBuild } from "./types/build";
import { IGOOD } from "./types/GOOD";

export enum Action {
  None,
  Edit,
  Create,
}

function App() {
  const [, setRerender] = useState(true);
  const rerender = () => setRerender((old) => !old);

  const { enqueueSnackbar } = useSnackbar();

  const loaded = window.localStorage.getItem("GOODDatabase");
  const [database, setDatabase] = useState<IGOOD | null>(
    loaded ? JSON.parse(loaded) : null
  );
  const [action, setAction] = useState(Action.None);
  const [build, setBuild] = useState<IBuild>({} as IBuild);

  let content: React.ReactElement;
  switch (action) {
    // Main page UI
    case Action.None:
      content = (
        <BuildBrowser
          database={database ?? ({} as IGOOD)}
          setAction={setAction}
          setBuild={setBuild}
          rerender={rerender}
        />
      );
      break;
    // Build editor UI (with existing build)
    case Action.Edit:
      content = (
        <BuildEditor
          database={database!}
          existingBuild={build}
          setAction={setAction}
        />
      );
      break;
    // Build editor UI (without existing build)
    case Action.Create:
      content = <BuildEditor database={database!} setAction={setAction} />;
      break;
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ p: 2, position: "absolute", width: "100%" }}
      >
        <Tooltip
          title={
            <Typography>
              Load a new Genshin database (using the{" "}
              <a
                href="https://frzyc.github.io/genshin-optimizer/#/doc"
                target="_blank"
                rel="noreferrer"
              >
                GOOD
              </a>{" "}
              data format)
              <br />
              <br />
              Loading a new database will{" "}
              <b>delete all of your currently saved builds in the process</b>.
              Make sure you have a backup before doing this!
            </Typography>
          }
        >
          <Button component="label" fullWidth>
            Load Database File
            <input
              type="file"
              accept=".json"
              hidden
              onChange={(evt) => {
                const [file] = evt.target.files!;
                const reader = new FileReader();

                reader.addEventListener("load", () => {
                  const databaseString = String(reader.result);
                  const parsed = JSON.parse(databaseString);
                  if (parsed?.format !== "GOOD") {
                    enqueueSnackbar(
                      "Invalid database file provided. Nothing has been loaded.",
                      { variant: "error" }
                    );
                    return;
                  }

                  window.localStorage.setItem("GOODDatabase", databaseString);
                  window.localStorage.removeItem("storedBuilds");
                  setDatabase(parsed);
                  rerender();
                  enqueueSnackbar(
                    "Database has been loaded. Your previous builds have been deleted."
                  );
                });

                reader.readAsText(file);
              }}
            />
          </Button>
        </Tooltip>

        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <Tooltip
            title={
              <Typography>
                Load build presets from a JSON file. You can save a build preset
                via <b>Backup Current Builds</b>!
                <br />
                <br />
                Note: Loading from a file will{" "}
                <b>overwrite all current builds</b>.
              </Typography>
            }
          >
            <Button fullWidth component="label">
              Load saved builds
              <input
                type="file"
                accept=".json"
                hidden
                onChange={(evt) => {
                  const [file] = evt.target.files!;
                  const reader = new FileReader();

                  reader.addEventListener("load", () => {
                    const buildsSaveString = String(reader.result);

                    const parsed = JSON.parse(buildsSaveString);
                    if (parsed?.format !== "GBM") {
                      enqueueSnackbar(
                        "Invalid save file provided. Nothing has been loaded.",
                        { variant: "error" }
                      );
                      return;
                    }

                    window.localStorage.setItem("storedBuilds", parsed.data);
                    rerender();
                    enqueueSnackbar("Saved builds have been loaded!");
                  });

                  reader.readAsText(file);
                }}
              />
            </Button>
          </Tooltip>
          <Tooltip
            title={
              <Typography>
                Save the current builds into a JSON file, so that they can be
                loaded again later.
              </Typography>
            }
          >
            <Button
              fullWidth
              onClick={() => {
                const buildsJSON = window.localStorage.getItem("storedBuilds");
                if (!buildsJSON) {
                  enqueueSnackbar("You don't have any builds to save!", {
                    variant: "error",
                  });
                  return;
                }
                const url = window.URL.createObjectURL(
                  new Blob(
                    [JSON.stringify({ format: "GBM", data: buildsJSON })],
                    { type: "application/json" }
                  )
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                  "download",
                  `GenshinBuildsManager_save_${Date.now()}.json`
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
              }}
            >
              Backup current builds
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      <Container sx={{ height: "100%" }} maxWidth="xl">
        <Box
          display="flex"
          sx={{
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            gap: 2,
          }}
        >
          {content}
        </Box>
      </Container>

      <Typography
        sx={{ position: "absolute", bottom: 8, left: 8, fontSize: 12 }}
      >
        Genshin Builds Manager is not affiliated with or endorsed by HoYoverse
      </Typography>
      {/* <Link
        sx={{ position: "absolute", bottom: 8, right: 8 }}
        href="/"
        target="_blank"
        rel="noreferrer"
      >
        <GitHub fontSize="small" />
      </Link> */}
    </>
  );
}

export default App;
