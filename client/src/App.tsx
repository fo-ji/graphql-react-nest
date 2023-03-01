import './App.css';
import { Main, NotFound, SignIn, SignUp } from './components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './routes/AuthRoute';
import client from './lib/apollo-client';
import { ApolloProvider } from '@apollo/client';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signin"
            element={<PublicRoute children={<SignIn />} />}
          />
          <Route
            path="/signup"
            element={<PublicRoute children={<SignUp />} />}
          />
          <Route path="/" element={<PrivateRoute children={<Main />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
