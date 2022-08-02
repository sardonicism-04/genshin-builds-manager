# Textures:
# - Characters: https://github.com/Escartem/GenshinTextures/tree/master/Texture2D/UI/AvatarIcon
# - Artifacts: https://github.com/Escartem/GenshinTextures/tree/master/Texture2D/UI/RelicIcon
# - Weapons: https://github.com/Escartem/GenshinTextures/tree/master/Texture2D/UI/EquipIcon

# Data:
# - Characters: https://github.com/Dimbreath/GenshinData/blob/master/ExcelBinOutput/AvatarExcelConfigData.json
# - Scaling Curves: https://github.com/Dimbreath/GenshinData/blob/master/ExcelBinOutput/AvatarCurveExcelConfigData.json
# - Weapon Data: https://github.com/Dimbreath/GenshinData/blob/master/ExcelBinOutput/WeaponExcelConfigData.json
# - Text Map [EN]: https://raw.githubusercontent.com/Dimbreath/GenshinData/master/TextMap/TextMapEN.json
# - Artifact Data: https://raw.githubusercontent.com/Dimbreath/GenshinData/master/ExcelBinOutput/ReliquaryExcelConfigData.json
# - Artifact Scaling Data: https://github.com/Dimbreath/GenshinData/blob/master/ExcelBinOutput/ReliquaryLevelExcelConfigData.json

from __future__ import annotations
from collections import defaultdict

import pathlib
from typing import TYPE_CHECKING

import requests

from constants import DataFileBase

if TYPE_CHECKING:
    from _types import CharacterData, CharacterBases

OUTPUT_DIR = pathlib.Path("./output")


def get_textmap() -> dict[str, str]:
    resp = requests.get(str(DataFileBase / "TextMap" / "TextMapEN.json"))
    data: dict[str, str] = resp.json()
    return data


TEXTMAP = get_textmap()


def find(data: list[dict], **kv_pairs):
    for item in data:
        if all([item[k] == v for k, v in kv_pairs.items()]):
            return item
    return {}


def get_character_data() -> list[CharacterData]:
    resp = requests.get(
        str(DataFileBase / "ExcelBinOutput" / "AvatarExcelConfigData.json")
    )
    data: list[dict] = resp.json()

    output = []
    for obj in data:
        try:
            min_data: CharacterData = {
                "id": obj["id"],
                "ascension_id": obj["avatarPromoteId"],
                "icon": obj["iconName"],
                "text_map_key": str(obj["nameTextMapHash"]),
                "base": {
                    "hp": obj["hpBase"],
                    "atk": obj["attackBase"],
                    "def_": obj["defenseBase"],
                },
                "curves": {
                    "hp": find(obj["propGrowCurves"], type="FIGHT_PROP_BASE_HP")[
                        "growCurve"
                    ],
                    "atk": find(obj["propGrowCurves"], type="FIGHT_PROP_BASE_ATTACK")[
                        "growCurve"
                    ],
                    "def_": find(obj["propGrowCurves"], type="FIGHT_PROP_BASE_DEFENSE")[
                        "growCurve"
                    ],
                },
            }
        except KeyError:
            continue
        else:
            output.append(min_data)

    return output


def get_scaling_curves() -> list[dict[str, dict[str, int]]]:
    resp = requests.get(
        str(DataFileBase / "ExcelBinOutput" / "AvatarCurveExcelConfigData.json")
    )
    data: list[dict] = resp.json()

    return [
        {
            "hp": {
                curve["type"]: curve["value"]
                for curve in lvl["curveInfos"]
                if curve["type"].startswith("GROW_CURVE_HP")
            },
            "atk": {
                curve["type"]: curve["value"]
                for curve in lvl["curveInfos"]
                if curve["type"].startswith("GROW_CURVE_ATTACK")
            },
            "def_": {
                curve["type"]: curve["value"]
                for curve in lvl["curveInfos"]
                if curve["type"].startswith("GROW_CURVE_HP")
            },
        }
        for lvl in data
    ]


def get_ascension_values() -> dict[int, dict[int, CharacterBases]]:
    resp = requests.get(
        str(DataFileBase / "ExcelBinOutput" / "AvatarPromoteExcelConfigData.json")
    )
    data: list[dict] = resp.json()

    ascension_data: defaultdict[int, dict[int, dict[str, int]]] = defaultdict(dict)
    for promotion in data:
        props = promotion["addProps"]
        ascension_data[promotion["avatarPromoteId"]][
            promotion.get("promoteLevel", 0)
        ] = {
            "hp": find(props, propType="FIGHT_PROP_BASE_HP").get("value", 0),
            "atk": find(props, propType="FIGHT_PROP_BASE_ATTACK").get("value", 0),
            "def_": find(props, propType="FIGHT_PROP_BASE_DEFENSE").get("value", 0),
        }
    return ascension_data  # type: ignore
