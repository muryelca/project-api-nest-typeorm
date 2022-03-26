import React from 'react';
import { Switch, Route } from 'react-router-dom'
import login from './pages/login';
import register from './pages/register';

export default () => {

    return (
        <Switch>
            <Route exact path="/login">
            login
            </Route>

            <Route exact path="/register">
            register
            </Route>
        </Switch>
    )

}