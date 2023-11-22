import React from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const DashboardNavbar = () => {
    const location = useLocation();

    return (
      <Nav variant="tabs" className="justify-content-center bg-dark">
        <Nav.Item>
          <Nav.Link href="/dashboard" active={location.pathname === '/dashboard'}>
            Stock Balance
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
            <Nav.Link href="/ProfitAnalysis" active={location.pathname === '/ProfitAnalysis'}>
                Profit and Loss Reports
            </Nav.Link>
        </Nav.Item>

        <form className="d-flex justify-content-end mr-5 pr-5">
                <a href="/login" className="btn text-danger" type="submit">Logout</a>
        </form>

      </Nav>
    );
}





export default DashboardNavbar;