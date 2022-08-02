from __future__ import annotations
from pathlib import Path

from typing import TYPE_CHECKING

import requests

from constants import TexturesBase

if TYPE_CHECKING:
    from _types import CharacterData, ArtifactData


def get_character_image(path: Path, character: CharacterData):
    url_path = character["icon"].replace("_", "/")
    resp = requests.get(str(TexturesBase / url_path / (character["icon"] + ".png")))
    if resp.status_code != 200:
        return

    image_path = path / "avatar.png"
    image_path.unlink(missing_ok=True)
    with image_path.open("b+w") as file:
        file.write(resp.content)
    print(f"Wrote {image_path}")


def get_artifact_image(path: Path, artifact: ArtifactData):
    url_path = "UI/RelicIcon"
    resp = requests.get(str(TexturesBase / url_path / (artifact["icon"] + ".png")))
    if resp.status_code != 200:
        return

    image_path = path / f"{artifact['slot']}.png"
    image_path.unlink(missing_ok=True)
    with image_path.open("b+w") as file:
        file.write(resp.content)
    print(f"Wrote {image_path}")
