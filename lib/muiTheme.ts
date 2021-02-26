import { colors, createMuiTheme } from '@material-ui/core';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.deepPurple[500]
    },
    secondary: {
      main: colors.blueGrey[700]
    }
  }
});

export default muiTheme;
