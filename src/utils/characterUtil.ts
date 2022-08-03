import characters from "../data/characters";
import { ICharacter } from "../types/character";

interface CharacterStats {
  hp: number;
  atk: number;
  def_: number;
}

export const getCharacterBaseStats = (
  character?: ICharacter
): CharacterStats => {
  if (!character) {
    return {} as CharacterStats;
  }
  const charData = characters[character.key];
  const levelMults: CharacterStats =
    charData.data.scalings.level_multipliers[character.level - 1];
  const ascensionScaled: CharacterStats =
    charData.data.scalings.ascension_values[String(character.ascension)];

  return {
    hp: charData.data.base.hp * levelMults.hp + ascensionScaled.hp,
    atk: charData.data.base.atk * levelMults.atk + ascensionScaled.atk,
    def_: charData.data.base.def_ * levelMults.def_ + ascensionScaled.def_,
  };
};
