import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
});
