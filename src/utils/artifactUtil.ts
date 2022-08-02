import artifactScaling from "../data/artifacts/scaling.json";
import { IArtifact } from "../types/artifact";

const getUpperCaseChars = (content: string): string => {
  return [...content].filter((char) => char.toUpperCase() === char).join("");
};

export const artifactID = (artifact: IArtifact): string => {
  // Abbreviate the artifact set name (i.e. TenacityOfTheMillelith -> TOTM)
  const setNameAbbr = getUpperCaseChars(artifact.setKey);
  // Generate an ID for artifact substats
  const substatId = artifact.substats
    .map((sub) => `${getUpperCaseChars(sub.key)}${sub.value}`)
    .join("");
  // Combine everything to return a mostly-unique artifact ID
  return `${setNameAbbr}${artifact.rarity}${artifact.level}${getUpperCaseChars(
    artifact.mainStatKey
  )}${substatId}`;
};

export const getMainStat = (artifact: IArtifact): number => {
  const mainStat: number =
    artifactScaling[artifact.rarity][artifact.level][artifact.mainStatKey];
  if (mainStat < 1.0) {
    return mainStat * 100;
  } else {
    return mainStat;
  }
};

const StatMapping = {
  hp: "HP",
  hp_: "HP%",
  atk: "ATK",
  atk_: "ATK%",
  def: "DEF",
  def_: "DEF%",
  eleMas: "Elemental Mastery",
  enerRech_: "Energy Recharge",
  heal_: "Healing Bonus",
  critRate_: "Crit Rate",
  critDMG_: "Crit DMG",
  physical_dmg_: "Physical DMG Bonus",
  anemo_dmg_: "Anemo DMG Bonus",
  geo_dmg_: "Geo DMG Bonus",
  electro_dmg_: "Electro DMG Bonus",
  hydro_dmg_: "Hydro DMG Bonus",
  pyro_dmg_: "Pyro DMG Bonus",
  cryo_dmg_: "Cryo DMG Bonus",
  dendro_dmg_: "Dendro DMG Bonus",
};

export const formatStat = (stat: string): string => {
  return StatMapping[stat] ?? stat;
};
