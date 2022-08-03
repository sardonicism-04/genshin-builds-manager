from __future__ import annotations

from typing import TYPE_CHECKING

from fetch_data import get_ascension_values, get_scaling_curves

if TYPE_CHECKING:
    from _types import CharacterData, CharacterScaling

CURVES = get_scaling_curves()
ASCENSION_VALUES = get_ascension_values()


def build_scaling(data: list[CharacterData]) -> dict[int, CharacterScaling]:
    scalings: dict[int, CharacterScaling] = {}
    for character in data:
        scalings[character["id"]] = {  # type: ignore
            "level_multipliers": [
                {
                    k: CURVES[lvl][k][character["curves"][k]]
                    for k in ["hp", "atk", "def_"]
                } for lvl in range(100)
            ],
            "ascension_values": {
                ascension: {
                    k: ASCENSION_VALUES[character["ascension_id"]][ascension][k]
                    for k in ["hp", "atk", "def_"]
                }
                for ascension in range(0, 7)
            },
        }

    return scalings
