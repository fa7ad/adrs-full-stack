import Link from 'next/link';
import { Edit, Home, People, SettingsRemote } from '@material-ui/icons';
import { List, ListItemIcon, ListItem, ListItemText, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  list: {
    width: 250
  }
}));

type NavListProps = {
  toggleDrawer: (state: boolean) => CommonComponents.DrawerToggleHandler;
  auth: boolean;
};

const NavList: React.FC<NavListProps> = ({ toggleDrawer, auth }) => {
  const classes = useStyles();

  return (
    <div className={classes.list} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem button>
          <ListItemIcon>{auth ? <SettingsRemote /> : <Home />}</ListItemIcon>
          <Link href='/'>
            <ListItemText primary='Home' />
          </Link>
        </ListItem>
        {auth ? (
          <>
            <ListItem button>
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <Link href='/profile/edit'>
                <ListItemText primary='Edit Profile' />
              </Link>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <Link href='/contacts'>
                <ListItemText primary='Emergency Contacts' />
              </Link>
            </ListItem>
          </>
        ) : null}
      </List>
    </div>
  );
};
export default NavList;
