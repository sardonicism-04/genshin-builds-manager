from pathlib import Path
from shutil import copytree, rmtree, copy as copyfile

BASE_OUTPUT = Path("./output")
BASE_DATA = Path("../src/data")


def copy_character_data():
    output_path = BASE_OUTPUT / "characters"
    data_path = BASE_DATA / "characters"

    for child in output_path.iterdir():
        if child.is_dir():
            rmtree(str(data_path / child.name), ignore_errors=True)
            copytree(str(child), str(data_path / child.name))
        elif child.is_file():
            (data_path / child.name).unlink(missing_ok=True)
            copyfile(str(child), str(data_path / child.name))


copy_character_data()
