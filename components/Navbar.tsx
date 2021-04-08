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
    padding: 0,
    '& > a': {
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
      width: '100%',
      height: '100%',
      padding: theme.spacing(0.75, 1)
    }
  }
}));

type NavProps = React.PropsWithChildren<{
  title: string;
}>;

const menuOrigin: PopoverOrigin = { vertical: 'top', horizontal: 'right' };

const NavBar = ({ title }: NavProps) => {
  const classes = useStyles();
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
              <Hidden smDown>&nbsp; {session?.user?.name}</Hidden>
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
                <Link href='/profile'>Edit Profile</Link>
              </MenuItem>
              <MenuItem className={classes.menuItemLink}>
                <Link href='/contacts'>Emergency Contacts</Link>
              </MenuItem>
              <MenuItem className={classes.menuItemLink}>
                <Link href='/auth/signout'>Sign out</Link>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Link href='/auth/signin'>
            <Button variant='text' color='inherit'>
              <AccountCircle />
              <Hidden smDown>&nbsp; Sign In</Hidden>
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
