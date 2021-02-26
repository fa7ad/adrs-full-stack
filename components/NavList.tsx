import Link from 'next/link';
import { Edit, Lock, Home, SettingsRemote } from '@material-ui/icons';
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
      {auth ? (
        <List>
          <ListItem button>
            <ListItemIcon>
              <SettingsRemote />
            </ListItemIcon>
            <Link href='/main'>
              <ListItemText primary='Home' />
            </Link>
          </ListItem>
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
              <Edit />
            </ListItemIcon>
            <Link href='/contacts'>
              <ListItemText primary='Emergency Contacts' />
            </Link>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <Link href='/auth/logout'>
              <ListItemText primary='Sign out' />
            </Link>
          </ListItem>
        </List>
      ) : (
        <List>
          <Link href='/'>
            <ListItem button>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
          </Link>
          <Link href='/auth/signin'>
            <ListItem button>
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText primary='Sign In / Sign Up' />
            </ListItem>
          </Link>
        </List>
      )}
    </div>
  );
};
export default NavList;
