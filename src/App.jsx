import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router';
import Navbar from './components/Navbar';
import './App.css';
import { UserInfoProvider } from './context/UserInfoProvider';
import HomePage from "./HomePage"
import Show from './Show';
import Index from './Index';
import UpdateRecipe from './UpdateRecipe';
import CreateRecipe from './CreateRecipe';
import MyItemsPage from './MyItemsPage';
import Login from './Login';
import UserRegister from './UserRegister';

function App() {
  return (
    <UserInfoProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path='recipes' element={<Index />} />
          <Route path='recipes/:recipeId' element={<Show />} />
          <Route path='recipes/myitems/:userId' element={<MyItemsPage />} />
          {/* <Route path='recipes/:userId/drafts' element={<DraftPage />} /> */}
          <Route path='recipes/:recipeId/update' element={<UpdateRecipe />} />
          <Route path='recipes/new' element={<CreateRecipe />} />

          <Route path='user/login' element={<Login />} />
          <Route path='user/register' element={<UserRegister />} />
          
          <Route path="*" element={<div className="text-red-600 text-center p-10">404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </UserInfoProvider>
  )
}

export default App
