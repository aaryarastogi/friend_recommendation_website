import { Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from './Components/login/Signup';
import Signin from './Components/login/Signin';
import UsersList from './Components/UsersDisplay/UsersDisplay';
import ProfilePage from './Components/Profile/ProfilePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Signup/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route path='/users' element={<UsersList/>}></Route>
        <Route path='/profile' element={<ProfilePage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
