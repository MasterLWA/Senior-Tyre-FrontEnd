import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from '../Pages/Loging'; // Corrected the import statement

import Dashbord from '../Pages/Dashbord';
import Billing from '../Pages/UserSide/Billing';
import Grn from '../Pages/UserSide/Grn';
import Editsupplier from '../Pages/UserSide/Editsupplier';
import Editgrn from '../Pages/UserSide/Editgrn';
import Mrn from '../Pages/UserSide/Mrn';
import Supplier from '../Pages/UserSide/Supplier';
import SubGRN from '../Pages/UserSide/SubGRN';
import EditSubGRN from '../Pages/UserSide/EditSubGRN';

import QtySubGRN from '../Pages/UserSide/EditQuantity/QtySubGRN';
import QtyGRN from '../Pages/UserSide/EditQuantity/QtyGRN';
import ProfitAnalysis from '../Pages/ProfiltAnalysis';

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />

        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/grn" element={<Grn />} />
        <Route path="/grn/:id" element={<Editgrn />} />
        <Route path="/mrn" element={<Mrn />} />
        <Route path="/suppliers" element={<Supplier />} />
        <Route path="/suppliers/:id" element={<Editsupplier />} />
        <Route path="/subgrn/:id" element={<EditSubGRN />} />
        <Route path="/subgrn" element={<SubGRN />} />

        <Route path='/qtygrn/:id' element={<QtyGRN />} />
        <Route path='/qtysubgrn/:id' element={<QtySubGRN />} />
        <Route path='/profitanalysis' element={<ProfitAnalysis />} />


      </Routes>
    </BrowserRouter>
  );
}

export default RouterApp;
