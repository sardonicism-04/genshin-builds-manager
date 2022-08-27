from __future__ import annotations

import pathlib
from collections import defaultdict
from typing import TYPE_CHECKING

import requests

from constants import (
    SLOT_MAPPING,
    STAT_MAPPING,
    WEAPON_TYPE_MAPPING,
    DataFileBase,
)

if TYPE_CHECKING:
    from _types import ArtifactData, CharacterBases, CharacterData, WeaponData

OUTPUT_DIR = pathlib.Path("./output")


def get_textmap() -> dict[str, str]:
    resp = requests.get(str(DataFileBase / ".." / "TextMap" / "TextMapEN.json"))
    data: dict[str, str] = resp.json()
    return data


TEXTMAP = get_textmap()


def find(data: list[dict], **kv_pairs):
    for item in data:
        if all([item[k] == v for k, v in kv_pairs.items()]):
            return item
    return {}


def get_character_data() -> list[CharacterData]:
    resp = requests.get(str(DataFileBase / "AvatarExcelConfigData.json"))
    data: list[dict] = resp.json()

    output = []
    for obj in data:
        try:
            min_data: CharacterData = {
                "id": obj["id"],
                "ascension_id": obj["avatarPromoteId"],
                "icon": obj["iconName"],
                "text_map_key": str(obj["nameTextMapHash"]),
                "weapon_type": WEAPON_TYPE_MAPPING[obj["weaponType"]],
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


def get_character_curves() -> list[dict[str, dict[str, int]]]:
    resp = requests.get(str(DataFileBase / "AvatarCurveExcelConfigData.json"))
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
    resp = requests.get(str(DataFileBase / "AvatarPromoteExcelConfigData.json"))
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


def get_artifact_sets() -> dict[int, str]:
    resp_sets = requests.get(str(DataFileBase / "ReliquarySetExcelConfigData.json"))
    resp_affix = requests.get(str(DataFileBase / "EquipAffixExcelConfigData.json"))

    raw_sets = resp_sets.json()
    affixes = resp_affix.json()

    sets: dict[int, str] = {}
    for _set in raw_sets:
        try:
            affix_id: int = _set["EquipAffixId"]
            equip_data: dict = next(
                filter(lambda obj: obj.get("id") == affix_id, affixes)
            )
            set_name = TEXTMAP[str(equip_data["nameTextMapHash"])]
            sets[_set["setId"]] = set_name
        except (KeyError, StopIteration):
            continue

    return sets


def get_artifact_data() -> list[ArtifactData]:
    resp = requests.get(str(DataFileBase / "ReliquaryExcelConfigData.json"))
    data = resp.json()

    output = []
    for obj in data:
        try:
            min_data: ArtifactData = {
                "id": obj["id"],
                "icon": obj["icon"],
                "text_map_key": str(obj["nameTextMapHash"]),
                "slot": SLOT_MAPPING[obj["equipType"]],
                "set_id": obj["setId"],
            }
        except KeyError:
            continue
        else:
            output.append(min_data)

    return output


def get_artifact_scaling():
    resp = requests.get(str(DataFileBase / "ReliquaryLevelExcelConfigData.json"))
    data = resp.json()

    scaling = {0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}}
    for promotion in data:
        props = promotion["addProps"]
        scaling[promotion.get("rank", 0)][promotion.get("level", 1) - 1] = {
            STAT_MAPPING[prop["propType"]]: prop["value"]
            for prop in props
            if prop["propType"] in STAT_MAPPING
        }

    return scaling


def get_weapon_data() -> list[WeaponData]:
    resp = requests.get(str(DataFileBase / "WeaponExcelConfigData.json"))
    data = resp.json()

    weapons = []
    for obj in data:
        try:
            weapon_data: WeaponData = {
                "id": obj["id"],
                "ascension_id": obj["weaponPromoteId"],
                "icon": obj["icon"],
                "text_map_key": str(obj["nameTextMapHash"]),
                "type": WEAPON_TYPE_MAPPING[obj["weaponType"]],
                "stats": {
                    STAT_MAPPING.get(prop["propType"], prop["propType"]): {
                        "type": prop["propType"],
                        "base_value": prop["initValue"],
                        "curve": prop["type"],
                    }
                    for prop in obj["weaponProp"]
                    if "propType" in prop
                },
            }
            weapon_data["stats"]["base_atk"] = weapon_data["stats"].pop(
                "FIGHT_PROP_BASE_ATTACK"
            )
        except KeyError:
            continue
        else:
            weapons.append(weapon_data)

    return weapons


def get_weapon_curves() -> list[dict[str, int]]:
    resp = requests.get(str(DataFileBase / "WeaponCurveExcelConfigData.json"))
    data = resp.json()

    return [
        {curve_info["type"]: curve_info["value"] for curve_info in curve["curveInfos"]}
        for curve in data
    ]


def get_weapon_ascension_base_atk(weapons: list[WeaponData]) -> dict[int, int]:
    resp = requests.get(str(DataFileBase / "WeaponPromoteExcelConfigData.json"))
    data = resp.json()

    values = {}
    for weapon in weapons:
        values[weapon["id"]] = {}
        for obj in data:
            if obj["weaponPromoteId"] != weapon["ascension_id"]:
                continue

            try:
                values[weapon["id"]][obj.get("promoteLevel", 0)] = next(
                    filter(
                        lambda prop: prop["propType"] == "FIGHT_PROP_BASE_ATTACK",
                        obj["addProps"],
                    )
                ).get("value", 0)
            except StopIteration:
                continue

    return values
