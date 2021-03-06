import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import Header from './components/Header';
import LandingScreen from './screens/LandingScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostScreen from './screens/PostScreen';
import NotFound from './screens/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={LandingScreen} />
            <PrivateRoute exact path="/:acc_id" component={ProfileScreen} />
            <PrivateRoute path="/p/:acc_id/:post_id" component={PostScreen} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
