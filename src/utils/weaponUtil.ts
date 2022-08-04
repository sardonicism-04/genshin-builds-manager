import isEqual from "lodash/isEqual";
import pick from "lodash/pick";
import weapons from "../data/weapons";
import { StatKey } from "../types/constants";
import { IWeapon } from "../types/weapon";

export const getWeaponBaseAtk = (weapon: IWeapon): number => {
  const data = weapons[weapon.key as keyof typeof weapons].data;
  const weaponBaseAtk =
    data.stats.base_atk.base_value * data.scalings.base_atk[weapon.level - 1] +
    data.ascension_base_atk[weapon.ascension];
  return weaponBaseAtk;
};

export const getWeaponSubstat = (
  weapon: IWeapon,
  stat: StatKey
): number | undefined => {
  const data = weapons[weapon.key as keyof typeof weapons].data;

  const substat = data.stats[stat as keyof typeof data.stats];
  if (substat) {
    const scaled = substat.base_value * data.scalings[stat][weapon.level - 1];
    return scaled;
  }
  return undefined;
};

export const isWeaponEqual = (weapon: IWeapon, other?: IWeapon): boolean => {
  return isEqual(
    pick(weapon, ["key", "level", "ascension", "refinement"]),
    pick(other, ["key", "level", "ascension", "refinement"])
  );
};
