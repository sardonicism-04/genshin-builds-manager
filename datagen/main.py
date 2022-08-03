from argparse import ArgumentParser

from copy_data import copy_artifact_data, copy_character_data, copy_weapon_data
from generate_data import (
    generate_artifact_dirs,
    generate_character_dirs,
    generate_weapon_data,
)


def main():
    parser = ArgumentParser()
    parser.add_argument("--no-images", action="store_true")

    args = parser.parse_args()

    print("Generating character data")
    generate_character_dirs(no_images=args.no_images)
    print("Generating artifact data")
    generate_artifact_dirs(no_images=args.no_images)
    print("Generating weapon data")
    generate_weapon_data(no_images=args.no_images)

    print("Copying character data")
    copy_character_data()
    print("Copying artifact data")
    copy_artifact_data()
    print("Copying weapon data")
    copy_weapon_data()


if __name__ == "__main__":
    main()
