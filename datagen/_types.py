from __future__ import annotations

from typing import TypedDict


class CharacterBases(TypedDict):
    hp: int
    atk: int
    def_: int


class CharacterCurves(TypedDict):
    hp: str
    atk: str
    def_: str


class CharacterData(TypedDict):
    id: int
    ascension_id: int
    icon: str
    text_map_key: str
    base: CharacterBases
    curves: CharacterCurves


class CharacterScaling(TypedDict):
    level_multipliers: list[CharacterBases]
    ascension_values: dict[int, CharacterBases]


class ArtifactSet(TypedDict):
    id: int
    text_map_key: str
    pieces: ArtifactSetPieces


class ArtifactData(TypedDict):
    id: int
    icon: str
    text_map_key: str
    slot: str
    set_id: int


class ArtifactSetPieces(TypedDict):
    plume: ArtifactData
    flower: ArtifactData
    sands: ArtifactData
    goblet: ArtifactData
    circlet: ArtifactData


class WeaponData(TypedDict):
    id: int
    text_map_key: str
