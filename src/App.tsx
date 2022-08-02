import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import { BuildEditor } from "./components/buildEditor";
import { IBuild } from "./types/build";
import { IGOOD } from "./types/GOOD";
import { Store } from "./utils/storage";

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
  const buildStorage = new Store("storedBuilds");

  let content: React.ReactElement;
  switch (action) {
    case Action.None:
      content = (
        <>
          <Button onClick={() => setAction(Action.Create)} disabled={!database}>
            Create new build
          </Button>
          <Select
            value=""
            disabled={!database}
            displayEmpty
            onChange={(evt: SelectChangeEvent) => {
              setBuild(buildStorage.getItem(evt.target.value));
              setAction(Action.Edit);
            }}
          >
            <MenuItem value="">Select an existing build</MenuItem>
            {[...buildStorage.keys()].map((build) => (
              <MenuItem key={build} value={build}>
                {build.replace(/_/g, " ")}
              </MenuItem>
            ))}
          </Select>
        </>
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

        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <Button fullWidth>Load saved builds</Button>
          <Button fullWidth>Save current builds</Button>
        </Stack>
      </Stack>

      <Container sx={{ height: "100%" }} maxWidth="md">
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
