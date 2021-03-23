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
        <Link href='/'>
          <ListItem button>
            <ListItemIcon>{auth ? <SettingsRemote /> : <Home />}</ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
        </Link>
        {auth ? (
          <>
            <Link href='/profile/edit'>
              <ListItem button>
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText primary='Edit Profile' />
              </ListItem>
            </Link>
            <Link href='/contacts'>
              <ListItem button>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary='Emergency Contacts' />
              </ListItem>
            </Link>
          </>
        ) : null}
      </List>
    </div>
  );
};
export default NavList;
