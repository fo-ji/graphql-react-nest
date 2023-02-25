import './App.css';
import { Main, NotFound, SignIn, SignUp } from './components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './routes/AuthRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<PublicRoute children={<SignIn />} />} />
        <Route path="/signup" element={<PublicRoute children={<SignUp />} />} />
        <Route path="/" element={<PrivateRoute children={<Main />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
