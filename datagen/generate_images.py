from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

import requests

from constants import TexturesBase

if TYPE_CHECKING:
    from _types import ArtifactData, CharacterData, WeaponData


def get_character_image(path: Path, character: CharacterData) -> bool:
    resp = requests.get(
        str(TexturesBase / "character_icon" / (character["icon"] + ".png"))
    )
    if resp.status_code != 200:
        return False

    image_path = path / "avatar.png"
    image_path.unlink(missing_ok=True)
    with image_path.open("b+w") as file:
        file.write(resp.content)
    print(f"Wrote {image_path}")
    return True


def get_artifact_image(path: Path, artifact: ArtifactData) -> bool:
    resp = requests.get(str(TexturesBase / "equip" / (artifact["icon"] + ".png")))
    if resp.status_code != 200:
        return False

    image_path = path / f"{artifact['slot']}.png"
    image_path.unlink(missing_ok=True)
    with image_path.open("b+w") as file:
        file.write(resp.content)
    print(f"Wrote {image_path}")
    return True


def get_weapon_image(path: Path, weapon: WeaponData) -> bool:
    resp = requests.get(str(TexturesBase / "equip" / (weapon["icon"] + ".png")))
    if resp.status_code != 200:
        return False

    image_path = path / "icon.png"
    image_path.unlink(missing_ok=True)
    with image_path.open("b+w") as file:
        file.write(resp.content)
    print(f"Wrote {image_path}")
    return True
