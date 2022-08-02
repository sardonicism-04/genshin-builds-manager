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
  const levelScaled: CharacterStats =
    charData.data.scalings.level_scaled[character.level - 1];
  const ascensionScaled: CharacterStats =
    charData.data.scalings.ascension_values[String(character.ascension)];

  return {
    hp: levelScaled.hp + ascensionScaled.hp,
    atk: levelScaled.atk + ascensionScaled.atk,
    def_: levelScaled.def_ + ascensionScaled.def_,
  };
};
