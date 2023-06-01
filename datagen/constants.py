from yarl import URL

# Source for textures to be downloaded from
TexturesBase = URL("https://enka.network/ui")
# Source for data files to be downloaded from
DataFileBase = URL(
    "https://raw.githubusercontent.com/Sycamore0/GenshinData/main/ExcelBinOutput"
)

# Map data stat names to GOOD stat keys
STAT_MAPPING = {
    "FIGHT_PROP_HP": "hp",
    "FIGHT_PROP_HP_PERCENT": "hp_",
    "FIGHT_PROP_ATTACK": "atk",
    "FIGHT_PROP_ATTACK_PERCENT": "atk_",
    "FIGHT_PROP_DEFENSE": "def",
    "FIGHT_PROP_DEFENSE_PERCENT": "def_",
    "FIGHT_PROP_CRITICAL": "critRate_",
    "FIGHT_PROP_CRITICAL_HURT": "critDMG_",
    "FIGHT_PROP_ELEMENT_MASTERY": "eleMas",
    "FIGHT_PROP_CHARGE_EFFICIENCY": "enerRech_",
    "FIGHT_PROP_HEAL_ADD": "heal_",
    "FIGHT_PROP_FIRE_ADD_HURT": "pyro_dmg_",
    "FIGHT_PROP_ELEC_ADD_HURT": "electro_dmg_",
    "FIGHT_PROP_WATER_ADD_HURT": "hydro_dmg_",
    "FIGHT_PROP_WIND_ADD_HURT": "anemo_dmg_",
    "FIGHT_PROP_ROCK_ADD_HURT": "geo_dmg_",
    "FIGHT_PROP_GRASS_ADD_HURT": "dendro_dmg_",
    "FIGHT_PROP_ICE_ADD_HURT": "cryo_dmg_",
    "FIGHT_PROP_PHYSICAL_ADD_HURT": "physical_dmg_",
}

# Map data slot names to GOOD slot keys
SLOT_MAPPING = {
    "EQUIP_BRACER": "flower",
    "EQUIP_SHOES": "sands",
    "EQUIP_RING": "goblet",
    "EQUIP_NECKLACE": "plume",
    "EQUIP_DRESS": "circlet",
}

# Map data weapon types to GOOD weapon type keys
WEAPON_TYPE_MAPPING = {
    "WEAPON_BOW": "Bow",
    "WEAPON_CATALYST": "Catalyst",
    "WEAPON_CLAYMORE": "Claymore",
    "WEAPON_POLE": "Pole",
    "WEAPON_SWORD_ONE_HAND": "Sword",
}
