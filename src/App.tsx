import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import ManageStocks from './Components/Manage/ManageStocks';
import AddNewStock from './Components/Manage/AddNewStock';
import SignUp from './Components/SignUp/SignUp';
import Browse from './Components/Browse/Browse';
import BuyStock from './Components/Browse/BuyStock';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      <Routes location={location}>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/browse' element={<RequireAuth redirectTo='/login'><Browse /></RequireAuth>} />
        <Route path='/buyStock/:stockName' element={<RequireAuth redirectTo='/login'><BuyStock /></RequireAuth>} />
        <Route path='/dashboard' element={<RequireAuth redirectTo='/login'><Dashboard /></RequireAuth>} />
        <Route path='/manageStocks' element={<RequireAuth redirectTo='/login'><ManageStocks /></RequireAuth>} />
        <Route path='/newStock' element={<RequireAuth redirectTo='/login'><AddNewStock /></RequireAuth>} />
      </Routes>
    </div>
  );
}

function RequireAuth({ children, redirectTo }: any) {
  let isAuthenticated = localStorage.getItem('isLoggedIn') ? true : false;
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default App;
