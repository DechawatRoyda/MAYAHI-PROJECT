import './App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Profilescreen from './screens/Profilescreen';
import Landingscreen from './screens/Landingscreen';
import Foodscreen from './screens/Foodscreen';
import Eventscreen from './screens/Eventscreen';
import Boardgamescreen from './screens/Boardgamescreen';
// import TransactionScreen from './screens/Transactionscreen';
// import Chartscreen from './screens/Chartscreen';
import Adminscreen from './screens/Adminscreen';
// import Requestscreen from './screens/Requestscreen';
// import Alluserscreen from './screens/Alluserscreen';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" exact element={<Homescreen/>}></Route>
          <Route path="/booking/:roomid/:fromdate/:todate" exact element={<Bookingscreen/>}></Route>
          <Route path="/register" exact element={<Registerscreen/>}></Route>
          <Route path="/login" exact element={<Loginscreen/>}></Route>
          <Route path="/profile/:key" eaxact element={<Profilescreen/>}></Route>
          <Route path="/" exact element={<Landingscreen/>}></Route>
          <Route path="/food" exact element={<Foodscreen/>}></Route>
          <Route path="/event" exact element={<Eventscreen/>}></Route>
          <Route path="/boardgame" exact element={<Boardgamescreen/>}></Route>
          {/* <Route path="/transaction" exact element={<TransactionScreen/>}></Route>
          <Route path="/chart" exact element={<Chartscreen/>}></Route>
          <Route path="/allusers" exact element={<Alluserscreen/>}></Route>
          <Route path="/request" exact element={<Requestscreen/>}></Route> */}
          <Route path="/admin/:key" exact element={<Adminscreen/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
