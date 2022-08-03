import DeleteForever from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { isEqual, uniqueId } from "lodash";
import React, { useState } from "react";
import weaponData from "../data/weapons";
import { IBuild } from "../types/build";
import { IWeapon } from "../types/weapon";
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
        {build.weapon && (
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
            gridTemplateColumns: "repeat(5, 1fr)",
            overflow: "scroll",
          }}
        >
          <Card sx={{ height: "450px", m: 1 }}>
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
          {weapons.map((weapon) => {
            const _weapon = weaponData[weapon.key as keyof typeof weaponData];
            if (!weapon) {
              return <></>;
            }

            return (
              <Card
                sx={{
                  height: "450px",
                  m: 1,
                  backgroundColor: isEqual(weapon, build.weapon)
                    ? "#515151"
                    : "black",
                }}
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
