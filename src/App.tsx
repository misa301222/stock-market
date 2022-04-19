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
import ManageStockHistory from './Components/StockHistory/ManageStockHistory';
import Settings from './Components/Settings/Settings';
import StockDetailedInfo from './Components/SocksDetailedInfo/StockDetailedInfo';
import StocksBought from './Components/StocksBought/StocksBought';
import StocksSold from './Components/StocksSold/StocksSold';
import Logout from './Components/Login/Logout';
import ManageWallet from './Components/Manage/ManageWallet';
import UserProfile from './Components/UserProfile/UserProfile';
import EditProfileInfo from './Components/UserProfile/EditProfileInfo';
import SearchUsers from './Components/UserProfile/SearchUsers';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      <Routes location={location}>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/browse' element={<RequireAuth redirectTo='/login'><Browse /></RequireAuth>} />
        <Route path='/searchUsers' element={<RequireAuth redirectTo='/login'><SearchUsers /></RequireAuth>} />
        <Route path='/buyStock/:stockName' element={<RequireAuth redirectTo='/login'><BuyStock /></RequireAuth>} />
        <Route path='/dashboard' element={<RequireAuth redirectTo='/login'><Dashboard /></RequireAuth>} />
        <Route path='/manageStocks' element={<RequireAuth redirectTo='/login'><ManageStocks /></RequireAuth>} />
        <Route path='/newStock' element={<RequireAuth redirectTo='/login'><AddNewStock /></RequireAuth>} />
        <Route path='/settings/manageStockHistory' element={<RequireAuth redirectTo='/login'><ManageStockHistory /></RequireAuth>} />
        <Route path='/settings' element={<RequireAuth redirectTo='/login'><Settings /></RequireAuth>} />
        <Route path='/settings/manageStocks' element={<RequireAuth redirectTo='/login'><ManageStocks /></RequireAuth>} />
        <Route path='/settings/manageWallet' element={<RequireAuth redirectTo='/login'><ManageWallet /></RequireAuth>} />
        <Route path='/stocksBoughtHistory/:stockName' element={<RequireAuth redirectTo='/login'><StocksBought /></RequireAuth>} />
        <Route path='/stocksSoldHistory/:stockName' element={<RequireAuth redirectTo='/login'><StocksSold /></RequireAuth>} />
        <Route path='/stockDetailedInfo/:stockName' element={<RequireAuth redirectTo='/login'><StockDetailedInfo /></RequireAuth>} />
        <Route path='/userProfile/:email' element={<RequireAuth redirectTo='/login'><UserProfile /></RequireAuth>} />
        <Route path='/settings/editProfileInfo/' element={<RequireAuth redirectTo='/login'><EditProfileInfo /></RequireAuth>} />
      </Routes>
    </div>
  );
}

function RequireAuth({ children, redirectTo }: any) {
  let isAuthenticated = localStorage.getItem('isLoggedIn') ? true : false;
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default App;
