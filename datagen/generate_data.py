import json
import re
from pathlib import Path
from typing import TYPE_CHECKING, cast

from build_scaling import build_scaling
from fetch_data import (
    TEXTMAP,
    get_artifact_data,
    get_artifact_scaling,
    get_character_data,
)
from generate_images import get_artifact_image, get_character_image

if TYPE_CHECKING:
    from _types import ArtifactData

OUTPUT_PATH = Path("./output")

with open("../src/constants.json") as file:
    CONSTANTS = json.load(file)


def generate_character_dirs(no_images=False):
    data = get_character_data()
    scaling_data = build_scaling(data)

    for char_data in data:
        if char_data["text_map_key"] not in TEXTMAP:
            continue
        name = TEXTMAP[char_data["text_map_key"]]
        if name.replace(" ", "") not in CONSTANTS["Characters"]:
            continue

        path = OUTPUT_PATH / "characters" / name.replace(" ", "")
        path.mkdir(exist_ok=True, parents=True)

        json_path = path / "data.json"
        json_path.unlink(missing_ok=True)
        with json_path.open("x") as file:
            data = {
                "name": name,
                **char_data,
                "scalings": scaling_data[char_data["id"]],
            }
            json.dump(data, file, indent=2)

        if no_images is False:
            get_character_image(path, char_data)

        codegen_path = path / "index.tsx"
        codegen_path.unlink(missing_ok=True)
        with codegen_path.open("x") as file:
            code = re.sub(
                r"^\s*",
                "",
                """import avatar from "./avatar.png";
                import data from "./data.json";
                const toExport = { avatar, data };
                export default toExport;
                """,
                flags=re.M,
            ).strip()
            file.write(code)

    index_path = OUTPUT_PATH / "characters" / "index.tsx"
    index_path.unlink(missing_ok=True)
    with index_path.open("x") as file:
        code = re.sub(
            r"^\s*",
            "",
            """
        {0}
        {1}
        export default characters;
        """.format(
                "\n".join(
                    f"import {name} from './{name}';"
                    for name in CONSTANTS["Characters"]
                ),
                f"const characters = {{ {', '.join(CONSTANTS['Characters'])} }};",
            ),
            flags=re.M,
        ).strip()
        file.write(code)


def generate_artifact_dirs(no_images=False):
    data: list[ArtifactData] = get_artifact_data()
    scaling_data = get_artifact_scaling()

    for set_id, set_name in CONSTANTS["ArtifactSets"].items():
        path = OUTPUT_PATH / "artifacts" / set_name
        path.mkdir(exist_ok=True, parents=True)

        json_path = path / "data.json"
        json_path.unlink(missing_ok=True)
        with json_path.open("x") as file:
            pieces = {}
            for piece in filter(lambda x: x["set_id"] == int(set_id), data):
                if TYPE_CHECKING:
                    piece = cast(ArtifactData, piece)
                if piece["text_map_key"] not in TEXTMAP:
                    continue
                if piece["slot"] in pieces:
                    continue
                piece_name = TEXTMAP[piece["text_map_key"]]
                pieces[piece["slot"]] = {
                    "name": piece_name.replace(" ", "").replace("'", ""),
                    **piece,
                }
                if no_images is False:
                    get_artifact_image(path, piece)

            set_data = {
                "name": CONSTANTS["ArtifactSetNames"][set_name],
                "pieces": pieces,
            }
            json.dump(set_data, file, indent=2)

        set_export_path = path / "index.tsx"
        set_export_path.unlink(missing_ok=True)
        with set_export_path.open("x") as file:
            code = re.sub(
                r"^\s*",
                "",
                """{0}
                import data from "./data.json";
                const toExport = {{ {1}, data }};
                export default toExport;
                """.format(
                    "\n".join(f"import {slot} from './{slot}.png'" for slot in pieces),
                    ", ".join(pieces),
                ),
                flags=re.M,
            ).strip()
            file.write(code)

    scaling_path = OUTPUT_PATH / "artifacts" / "scaling.json"
    scaling_path.unlink(missing_ok=True)
    with scaling_path.open("x") as file:
        json.dump(scaling_data, file, indent=2)

    index_path = OUTPUT_PATH / "artifacts" / "index.tsx"
    index_path.unlink(missing_ok=True)
    with index_path.open("x") as file:
        code = re.sub(
            r"^\s*",
            "",
            """
        {0}
        {1}
        export default artifacts;
        """.format(
                "\n".join(
                    f"import {name} from './{name}';"
                    for name in CONSTANTS["ArtifactSets"].values()
                ),
                f"const artifacts = {{ {', '.join(CONSTANTS['ArtifactSets'].values())} }};",
            ),
            flags=re.M,
        ).strip()
        file.write(code)
