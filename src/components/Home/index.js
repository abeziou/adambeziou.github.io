import React from 'react';
import AnimatedCanvas from '../AnimatedCanvas';

import "./home.css"

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("test");
        return ([
        <AnimatedCanvas />,
        <section key="home-splash" id="home-splash">
            <header id="abeziou-header"><b>abeziou</b></header>
        </section>
        ]);
    }   
}

export default Home;