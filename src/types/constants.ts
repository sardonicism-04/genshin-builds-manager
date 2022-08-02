import {
  ArtifactSetNames,
  Characters,
  WeaponsSword,
  WeaponsBow,
  WeaponsCatalyst,
  WeaponsClaymore,
  WeaponsPolearm,
} from "../constants.json";

export type WeaponSwordKey = typeof WeaponsSword[number];
export type WeaponClaymoreKey = typeof WeaponsClaymore[number];
export type WeaponPoleArmKey = typeof WeaponsPolearm[number];
export type WeaponBowKey = typeof WeaponsBow[number];
export type WeaponCatalystKey = typeof WeaponsCatalyst[number];

export const allWeaponKeys = [
  ...WeaponsSword,
  ...WeaponsClaymore,
  ...WeaponsPolearm,
  ...WeaponsBow,
  ...WeaponsCatalyst,
] as const;
export type WeaponKey =
  | WeaponSwordKey
  | WeaponClaymoreKey
  | WeaponPoleArmKey
  | WeaponBowKey
  | WeaponCatalystKey;

export type StatKey =
  | "hp" //HP
  | "hp_" //HP%
  | "atk" //ATK
  | "atk_" //ATK%
  | "def" //DEF
  | "def_" //DEF%
  | "eleMas" //Elemental Mastery
  | "enerRech_" //Energy Recharge
  | "heal_" //Healing Bonus
  | "critRate_" //Crit Rate
  | "critDMG_" //Crit DMG
  | "physical_dmg_" //Physical DMG Bonus
  | "anemo_dmg_" //Anemo DMG Bonus
  | "geo_dmg_" //Geo DMG Bonus
  | "electro_dmg_" //Electro DMG Bonus
  | "hydro_dmg_" //Hydro DMG Bonus
  | "pyro_dmg_" //Pyro DMG Bonus
  | "cryo_dmg_" //Cryo DMG Bonus
  | "dendro_dmg_"; // Dendro DMG Bonus

const ArtifactSetKeys = [...Object.keys(ArtifactSetNames)] as const;
export type ArtifactSetKey = typeof ArtifactSetKeys[number];
export type CharacterKey = typeof Characters[number];
