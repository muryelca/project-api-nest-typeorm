import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Login from './pages/login';
import Register from './pages/register';

const Routes = () => {

    return (
        <Switch>
            <Route exact path="/login">
            <Login>
                Login
            </Login>
            </Route>

            <Route exact path="/register">
            <Register>
                Register
            </Register>
            </Route>
        </Switch>
    );

}

export default Routes;