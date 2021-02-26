import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
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
  PopoverOrigin
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
  }
}));

const NavBar = () => {
  const router = useRouter();
  const classes = useStyles();
  const [, title] = usePageTitle();
  const [session] = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const auth = Boolean(session);

  const handleMenu: React.ReactEventHandler<HTMLButtonElement> = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goHome = () => {
    router.push(auth ? '/main' : '/');
  };

  const toggleDrawerClicked: React.ReactEventHandler<HTMLButtonElement> = () => {
    setDrawerOpen(p => !p);
  };

  const toggleDrawer: (isDrawerOpen: boolean) => CommonComponents.DrawerToggleHandler = isDrawerOpen => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(isDrawerOpen);
  };

  const menuOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'right'
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
        <Typography variant='h6' className={classes.title} onClick={goHome}>
          {title}
        </Typography>
        {auth && (
          <div>
            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
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
              <Link href='/profile/edit'>
                <MenuItem>Edit Profile</MenuItem>
              </Link>
              <Link href='/contacts'>
                <MenuItem>Emergency Contacts</MenuItem>
              </Link>
              <Link href='/auth/logout'>
                <MenuItem>Logout</MenuItem>
              </Link>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
