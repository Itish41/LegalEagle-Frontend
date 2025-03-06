import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import DocumentAnalysisPage from './components/DocumentAnalysisPage';
import AddRule from './components/AddRule';
import Dashboard from './components/Dashboard';
import ActionItems from './components/ActionItems';
import ComplianceRuleManager from './components/ComplianceRuleManager';
import './index.css';

const App: React.FC = () => {
//   useEffect(() => {
//     const handleScroll = () => {
//         const scrollPosition = window.scrollY;
//         if (scrollPosition > 50) { // Change this value based on when you want the effect to start
//             document.body.classList.add('streak-effect');
//         } else {
//             document.body.classList.remove('streak-effect');
//         }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//         window.removeEventListener('scroll', handleScroll);
//     };
// }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="document" element={<DocumentAnalysisPage />} />
          <Route path="rules" element={<AddRule />} />
          <Route path="compliance" element={<ComplianceRuleManager />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="action-items" element={<ActionItems />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;