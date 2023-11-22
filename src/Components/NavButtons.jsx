import React from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

function NavButton() {
  const location = useLocation();

  return (
      <div className='justify-content-center bg bg-dark'>
          <Nav variant="tabs" className="justify-content-center">
            <Nav.Item>
              <Nav.Link href="/billing" active={location.pathname === '/billing'}>
                Billing
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/suppliers" active={location.pathname === '/suppliers'}>
                Suppliers
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/grn" active={location.pathname === '/grn'}>
                GRN
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/subgrn" active={location.pathname === '/subgrn'}>
                Shop GRN
              </Nav.Link>
            </Nav.Item>

            <form className="d-flex justify-content-end mr-5 pr-5">
                <a href="/login" className="btn text-danger" type="submit">Logout</a>
            </form>
            
          </Nav>
        </div>
  
  );
}

export default NavButton;