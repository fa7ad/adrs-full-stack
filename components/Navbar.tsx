import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/client';

import { Menu as MenuIcon, AccountCircle } from '@material-ui/icons';
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  makeStyles,
  SwipeableDrawer,
  PopoverOrigin,
  Hidden,
  Button
} from '@material-ui/core';

import NavList from './NavList';
import { usePageTitle } from 'utils/pageTitle';

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  menuItemLink: {
    '& > a': {
      textDecoration: 'none',
      color: 'inherit'
    }
  }
}));

const menuOrigin: PopoverOrigin = { vertical: 'top', horizontal: 'right' };

const NavBar = () => {
  const classes = useStyles();
  const [, title] = usePageTitle();
  const [session] = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const auth = Boolean(session);

  const handleClose = () => setAnchorEl(null);
  const handleMenu: React.ReactEventHandler<HTMLButtonElement> = event => setAnchorEl(event.currentTarget);
  const toggleDrawerClicked: React.ReactEventHandler<HTMLButtonElement> = () => setDrawerOpen(p => !p);

  const toggleDrawer: (isDrawerOpen: boolean) => CommonComponents.DrawerToggleHandler = isDrawerOpen => event => {
    if (event?.type === 'keydown' && (event?.key === 'Tab' || event?.key === 'Shift')) return;
    setDrawerOpen(isDrawerOpen);
  };

  return (
    <AppBar position='fixed'>
      <SwipeableDrawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
        <NavList auth={auth} toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
      <Toolbar>
        <IconButton
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='menu'
          onClick={toggleDrawerClicked}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title}>
          {title}
        </Typography>
        {auth ? (
          <div>
            <Button
              variant='text'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              <AccountCircle />
              <Hidden mdDown>&nbsp; {session?.user?.name}</Hidden>
            </Button>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={menuOrigin}
              transformOrigin={menuOrigin}
              onClose={handleClose}
              onClick={handleClose}
              open={open}
              keepMounted
            >
              <MenuItem className={classes.menuItemLink}>
                <Link href='/profile/edit'>Edit Profile</Link>
              </MenuItem>
              <MenuItem className={classes.menuItemLink}>
                <Link href='/contacts'>Emergency Contacts</Link>
              </MenuItem>
              <MenuItem className={classes.menuItemLink}>
                <Link href='/auth/signout'>Logout</Link>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Link href='/auth/signin'>
            <>
              <Hidden mdUp>
                <IconButton aria-label='Sign in / Sign up' aria-controls='menu-appbar' color='inherit'>
                  <AccountCircle />
                </IconButton>
              </Hidden>
              <Hidden mdDown>
                <Button variant='text' color='inherit'>
                  <AccountCircle />
                  &nbsp; Sign In
                </Button>
              </Hidden>
            </>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
