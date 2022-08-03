import json
import re
from pathlib import Path
from shutil import rmtree
from typing import TYPE_CHECKING, cast

from build_scaling import build_scaling
from constants import WEAPON_TYPE_MAPPING
from fetch_data import (
    TEXTMAP,
    get_artifact_data,
    get_artifact_scaling,
    get_character_data,
    get_weapon_ascension_base_atk,
    get_weapon_curves,
    get_weapon_data,
)
from generate_images import (
    get_artifact_image,
    get_character_image,
    get_weapon_image,
)

if TYPE_CHECKING:
    from _types import ArtifactData

OUTPUT_PATH = Path("./output")

with open("../src/constants.json") as file:
    CONSTANTS = json.load(file)


def format_pascal_key(text: str) -> str:
    formatted = ""
    parts = text.split(" ")
    for part in parts:
        formatted += "".join(filter(str.isalpha, part)).title()
    return formatted


def generate_character_dirs(no_images=False):
    data = get_character_data()
    scaling_data = build_scaling(data)

    for char_data in data:
        if char_data["text_map_key"] not in TEXTMAP:
            continue
        name = TEXTMAP[char_data["text_map_key"]]
        if "".join(filter(str.isalpha, name)) not in CONSTANTS["Characters"]:
            continue

        path = OUTPUT_PATH / "characters" / format_pascal_key(name)
        path.mkdir(exist_ok=True, parents=True)

        if no_images is False:
            if get_character_image(path, char_data) is False:
                rmtree(str(path), ignore_errors=True)
                continue

        json_path = path / "data.json"
        json_path.unlink(missing_ok=True)
        with json_path.open("x") as file:
            data = {
                "name": name,
                **char_data,
                "scalings": scaling_data[char_data["id"]],
            }
            json.dump(data, file, indent=2)

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
                    "name": format_pascal_key(piece_name),
                    **piece,
                }
                if no_images is False:
                    if get_artifact_image(path, piece) is False:
                        continue

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


def generate_weapon_data(no_images=False):
    data = get_weapon_data()
    curves_data = get_weapon_curves()
    ascension_scaling = get_weapon_ascension_base_atk(data)

    for weapon in data:
        if weapon["text_map_key"] not in TEXTMAP:
            continue
        name = TEXTMAP[weapon["text_map_key"]]

        path = OUTPUT_PATH / "weapons" / format_pascal_key(name)
        path.mkdir(exist_ok=True, parents=True)

        if no_images is False:
            if get_weapon_image(path, weapon) is False:
                rmtree(str(path), ignore_errors=True)
                continue

        json_path = path / "data.json"
        json_path.unlink(missing_ok=True)
        with json_path.open("x") as file:
            scalings = {}
            for stat, stat_data in weapon["stats"].items():
                multipliers = []
                for lvl in range(100):
                    multipliers.append(curves_data[lvl][stat_data["curve"]])
                scalings[stat] = multipliers

            json_data = {
                "name": name,
                **weapon,
                "scalings": scalings,
                "ascension_base_atk": ascension_scaling[weapon["id"]],
            }
            json.dump(json_data, file, indent=2)

        codegen_path = path / "index.tsx"
        codegen_path.unlink(missing_ok=True)
        with codegen_path.open("x") as file:
            code = re.sub(
                r"^\s*",
                "",
                """import icon from "./icon.png";
                import data from "./data.json";
                const toExport = { data, icon };
                export default toExport;
                """,
                flags=re.M,
            )
            file.write(code)

    modules = [
        mod
        for mod in (OUTPUT_PATH / "weapons").iterdir()
        if not mod.name.endswith(".tsx")
    ]

    index_path = OUTPUT_PATH / "weapons" / "index.tsx"
    index_path.unlink(missing_ok=True)
    with index_path.open("x") as file:
        code = re.sub(
            r"^\s*",
            "",
            """
            {0}
            const weapons = {{ {1} }};
            export default weapons;
            """.format(
                "\n".join(
                    f"import {module.name} from './{module.name}';"
                    for module in modules
                ),
                ", ".join(mod.name for mod in modules),
            ),
            flags=re.M,
        )
        file.write(code)
