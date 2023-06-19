import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/user-dashboard/:id' element={
          <ProtectedRoutes>
            <UserDashboard />
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
