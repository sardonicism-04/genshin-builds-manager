import characters from "../data/characters";
import { ICharacter } from "../types/character";
import { IGOOD } from "../types/GOOD";
import { IWeapon } from "../types/weapon";
import { getWeaponBaseAtk } from "./weaponUtil";

interface CharacterStats {
  hp: number;
  atk: number;
  def_: number;
}

export const getCharacterBaseStats = (
  character?: ICharacter,
  weapon?: IWeapon
): CharacterStats => {
  if (!character) {
    return {} as CharacterStats;
  }
  const charData = characters[character.key].data;
  const levelMults: CharacterStats =
    charData.scalings.level_multipliers[character.level - 1];
  const ascensionScaled: CharacterStats =
    charData.scalings.ascension_values[character.ascension];

  const bases = {
    hp: charData.base.hp * levelMults.hp + ascensionScaled.hp,
    atk: charData.base.atk * levelMults.atk + ascensionScaled.atk,
    def_: charData.base.def_ * levelMults.def_ + ascensionScaled.def_,
  };

  if (weapon) {
    bases.atk += getWeaponBaseAtk(weapon);
  }

  return bases;
};

export const getCharacter = (
  database: IGOOD,
  charName?: string
): ICharacter | undefined => {
  return database.characters?.find((char) => char.key === charName);
};
