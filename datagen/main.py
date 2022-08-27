from argparse import ArgumentParser

from copy_data import copy_artifact_data, copy_character_data, copy_weapon_data
from generate_data import (
    generate_artifact_dirs,
    generate_character_dirs,
    generate_weapon_data,
    generate_constants,
)


def main():
    parser = ArgumentParser()
    parser.add_argument("--no-images", action="store_true")
    parser.add_argument("--no-copy", action="store_true")
    parser.add_argument("--no-write-constants", action="store_true")

    args = parser.parse_args()

    print("Generating constants")
    constants = generate_constants(args.no_write_constants)

    print("Generating character data")
    generate_character_dirs(constants, no_images=args.no_images)
    print("Generating artifact data")
    generate_artifact_dirs(constants, no_images=args.no_images)
    print("Generating weapon data")
    generate_weapon_data(constants, no_images=args.no_images)

    if not args.no_copy:
        print("Copying character data")
        copy_character_data()
        print("Copying artifact data")
        copy_artifact_data()
        print("Copying weapon data")
        copy_weapon_data()


if __name__ == "__main__":
    main()
