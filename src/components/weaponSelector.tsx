import DeleteForever from "@mui/icons-material/DeleteForever";
import { useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { uniqueId, uniqWith } from "lodash";
import React, { useState } from "react";
import weaponData from "../data/weapons";
import { IBuild } from "../types/build";
import { IWeapon } from "../types/weapon";
import { isWeaponEqual } from "../utils/weaponUtil";
import { WeaponComponent } from "./equipmentComponents";

interface IProps {
  weapons: IWeapon[];
  build: IBuild;
  setBuild: (build: IBuild) => void;
}

export const WeaponSelector = ({
  weapons,
  build,
  setBuild,
}: IProps): React.ReactElement => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        fullWidth
        variant="outlined"
        sx={{ height: "65px" }}
        color={build.weapon ? "primary" : "info"}
      >
        {build.weapon &&
          weapons.find((w) => isWeaponEqual(w, build.weapon)) && (
            <img
              src={weaponData[build.weapon.key].icon}
              height="32px"
              width="32px"
              alt="Weapon Icon"
              style={{ marginRight: 8 }}
            />
          )}
        {build.weapon ? "Change" : "Select"} Weapon
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "75%",
            width: "75%",

            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            overflow: "scroll",
          }}
        >
          <Card sx={{ height: "450px", m: 1 }} variant="outlined">
            <CardActionArea
              sx={{ height: "100%" }}
              onClick={() => {
                setBuild({
                  ...build,
                  weapon: undefined,
                });
                setOpen(false);
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <DeleteForever sx={{ fontSize: 256 }} />
                <Typography>Clear Weapon</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          {uniqWith(weapons, isWeaponEqual)
            .sort((a, b) => a.key.localeCompare(b.key))
            .map((weapon) => {
              const _weapon = weaponData[weapon.key as keyof typeof weaponData];
              if (!weapon) {
                return <></>;
              }

              return (
                <Card
                  sx={{
                    height: "450px",
                    m: 1,
                    backgroundColor: isWeaponEqual(weapon, build.weapon)
                      ? theme.palette.action.selected
                      : "none",
                  }}
                  variant="outlined"
                  key={uniqueId(weapon.key)}
                >
                  <CardActionArea
                    sx={{ height: "100%" }}
                    onClick={() => {
                      setBuild({
                        ...build,
                        weapon,
                      });
                      setOpen(false);
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="256"
                      image={_weapon.icon}
                      alt="le artifact"
                    />
                    <CardContent>
                      <WeaponComponent weapon={weapon} />
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
        </Paper>
      </Modal>
    </>
  );
};
