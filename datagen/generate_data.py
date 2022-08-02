import json
import re
from pathlib import Path

from build_scaling import build_scaling
from fetch_data import TEXTMAP, get_character_data
from generate_images import get_character_image

OUTPUT_PATH = Path("./output")

with open("../src/constants.json") as file:
    CONSTANTS = json.load(file)


def generate_character_dirs():
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

        # get_character_image(path, char_data)

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
        """.format(
                "\n".join(
                    f"import {name} from './{name}';"
                    for name in CONSTANTS["Characters"]
                ),
                f"export {{ {', '.join(CONSTANTS['Characters'])} }};",
            ),
            flags=re.M,
        ).strip()
        file.write(code)


generate_character_dirs()
