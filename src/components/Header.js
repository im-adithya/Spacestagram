import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import { Image, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import { AuthContext } from '../Auth';

import Popup from './Popup';
import FullViewer from './FullViewer';
import { useLogin } from '../hooks/useLogin';
import { useLogout } from '../actions/useLogout';
import logo from '../assets/logo-font.svg';

const Header = () => {
  const location = useLocation();
  const loginHandler = useLogin();
  const user = useContext(AuthContext).currentUser;
  const popup = useContext(AuthContext).popup.popup;
  const fullView = useContext(AuthContext).fv.fullView;

  const path = location.pathname.substring(1);
  if (path === '' && !user) return null;

  return (
    <header>
      {fullView && <FullViewer fullView={fullView} />}
      {popup && <Popup message={popup} />}
      <Navbar
        bg="light"
        variant="light"
        expand="lg"
        fixed="top"
        className={'shadow-sm py-0 zindex1 ' + (!user ? 'py-3' : '')}
        collapseOnSelect>
        <LinkContainer to="/" className="pointer">
          <Image src={logo} className="pl-3" width="140px" />
        </LinkContainer>
        <Nav className="ml-auto flex-row align-items-center mr-3">
          {!user && (
            <button
              className="button-3 d-flex justify-content-center align-items-center"
              onClick={loginHandler}>
              Log in
            </button>
          )}
          {user && (
            <NavDropdown
              title={
                <div className="pull-left">
                  <img
                    width="45px"
                    src={user.photoURL}
                    style={{ borderRadius: '25px' }}
                    className="p-2"
                    alt="user pic"
                  />
                </div>
              }
              id="username"
              align="end">
              <LinkContainer to="/me">
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={useLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar>
    </header>
  );
};

export default Header;
