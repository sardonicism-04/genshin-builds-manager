import { useState } from "react";
import { BuildEditor } from "./components/buildEditor";
import { Store } from "./utils/storage";
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
  const buildStorage = new Store("storedBuilds");

  return (
    <>
      <label>
        Load new GOOD Database File
        <input
          type="file"
          accept=".json"
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
      </label>

      {database &&
        (() => {
          switch (action) {
            case Action.None:
              return (
                <>
                  <button onClick={() => setAction(Action.Create)}>
                    Create new build
                  </button>
                  <label>
                    Edit Existing Build
                    <select
                      onChange={(evt) => {
                        setBuild(
                          buildStorage.getItem(
                            evt.target.selectedOptions[0].value
                          )
                        );
                        setAction(Action.Edit);
                      }}
                    >
                      <option value="">Select an existing build</option>
                      {[...buildStorage.keys()].map((build) => (
                        <option key={build} value={build.replace(/\s/g, "_")}>
                          {build}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              );
            case Action.Edit:
              return (
                <BuildEditor
                  database={database}
                  existingBuild={build}
                  setAction={setAction}
                />
              );
            case Action.Create:
              return <BuildEditor database={database} setAction={setAction} />;
          }
        })()}
    </>
  );
}

export default App;
