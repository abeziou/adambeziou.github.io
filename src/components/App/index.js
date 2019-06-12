import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import Home from '../Home'


const App = () => (
    <Router>
        <Route path={ROUTES.LANDING} component={Home} />
    </Router>
);

export default App;