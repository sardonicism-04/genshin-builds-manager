import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
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
  const loaded = window.localStorage.getItem("GOODDatabase");
  const [database, setDatabase] = useState<IGOOD | null>(
    loaded ? JSON.parse(loaded) : null
  );
  const [action, setAction] = useState(Action.None);
  const [build, setBuild] = useState<IBuild>({} as IBuild);

  let content: React.ReactElement;
  switch (action) {
    case Action.None:
      content = (
        <BuildBrowser
          database={database ?? ({} as IGOOD)}
          setAction={setAction}
          setBuild={setBuild}
        />
      );
      break;
    case Action.Edit:
      content = (
        <BuildEditor
          database={database!}
          existingBuild={build}
          setAction={setAction}
        />
      );
      break;
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
                  window.localStorage.setItem("GOODDatabase", databaseString);
                  setDatabase(JSON.parse(databaseString));
                });

                reader.readAsText(file);
              }}
            />
          </Button>
        </Tooltip>

        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <Button fullWidth>Load saved builds</Button>
          <Button fullWidth>Backup current builds</Button>
        </Stack>
      </Stack>

      <Container sx={{ height: "100%" }} maxWidth="lg">
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
    </>
  );
}

export default App;
