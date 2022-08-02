from functools import partial
from pathlib import Path
from shutil import copy as copyfile
from shutil import copytree, rmtree

BASE_OUTPUT = Path("./output")
BASE_DATA = Path("../src/data")


def copy_data(source: Path, dest: Path):
    for child in source.iterdir():
        if child.is_dir():
            rmtree(str(dest / child.name), ignore_errors=True)
            copytree(str(child), str(dest / child.name))
        elif child.is_file():
            (dest / child.name).unlink(missing_ok=True)
            copyfile(str(child), str(dest / child.name))


copy_character_data = partial(
    copy_data, BASE_OUTPUT / "characters", BASE_DATA / "characters"
)
copy_artifact_data = partial(
    copy_data, BASE_OUTPUT / "artifacts", BASE_DATA / "artifacts"
)
