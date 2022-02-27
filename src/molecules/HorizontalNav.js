import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import Nav from 'react-bootstrap/Nav';
import fetch from 'isomorphic-unfetch';
import Logo from '@assets/logos/theluupe.svg';
import Button from 'react-bootstrap/Button';
import { useApolloClient } from '@apollo/react-hooks';
import { useAuthState } from '@molecules/AuthProvider';
import { useRouter } from 'next/router';
import { EditUserModal } from '@organisms/EditUserModal';

export const HEADER_HEIGHT = '84px';

export function HorizontalNav() {
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const { user, loading } = useAuthState();

  const apolloClient = useApolloClient();
  const router = useRouter();
  const logOut = useCallback(async () => {
    await fetch('/auth/logout', {
      method: 'POST',
    });
    await Promise.all([apolloClient.reFetchObservableQueries(), router.push('/login')]);
  }, [router, apolloClient]);

  const openEditUserModal = useCallback(() => {
    setShowEditUserModal(true);
  }, []);

  const closeEditUserModal = useCallback(() => {
    setShowEditUserModal(false);
  }, []);

  return (
    <header>
      <EditUserModal show={showEditUserModal} onClose={closeEditUserModal} />
      <Wrapper className="py-2 px-4">
        <div className="d-flex align-items-center">
          <Nav.Item className="mr-4">
            <Link href="/">
              <a>
                <Logo css={{ color: 'var(--brand-red)' }} />
              </a>
            </Link>
          </Nav.Item>
          <Nav.Item className="mr-1">
            <a className="nav-link" href="https://theluupe.com/about">
              ABOUT
            </a>
          </Nav.Item>
          <Nav.Item className="mr-1">
            <a className="nav-link" href="https://theluupe.com/brands">
              BRANDS
            </a>
          </Nav.Item>
          <Nav.Item className="mr-1">
            <a className="nav-link" href="https://theluupe.com/our-artists">
              PHOTOGRAPHERS
            </a>
          </Nav.Item>
          <Nav.Item className="mr-1">
            <a className="nav-link" href="https://theluupe.com/blog">
              MAGAZINE
            </a>
          </Nav.Item>
        </div>
        {!loading && (
          <>
            {user ? (
              <Nav.Item className="mr-1">
                <span className="mr-3 text-capitalize font-weight-bold">{user.firstName}</span>
                <Button className="mr-3" variant="primary" onClick={openEditUserModal}>
                  Update Profile
                </Button>
                <Button variant="secondary" onClick={logOut}>
                  Logout
                </Button>
              </Nav.Item>
            ) : (
              <Nav.Item className="mr-1">
                <Link href="/login">
                  <a className="btn btn-secondary">Log in</a>
                </Link>
                <Link href="/signup">
                  <a className="btn btn-primary text-white ml-3"> Sign up</a>
                </Link>
              </Nav.Item>
            )}
          </>
        )}
      </Wrapper>
    </header>
  );
}

const Wrapper = styled(Nav)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT};
  border-bottom: 1px solid var(--gray-low-surface);
  background-color: white;
  position: fixed;
  width: 100%;
  top: 0;
`;
