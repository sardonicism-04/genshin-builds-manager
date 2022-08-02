from typing import Literal, TypedDict


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
    level_scaled: list[CharacterBases]
    ascension_values: dict[int, CharacterBases]
