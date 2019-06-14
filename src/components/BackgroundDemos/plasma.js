import React from 'react';
import { dot } from 'mathjs';

class Plasma extends React.Component {
    constructor(props) {
        super(props);
        this.plasmaBG = React.createRef();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        console.log("test");

        this.updateDimensions = this.updateDimensions.bind(this);
    }

    random = (st) => {
        return(
            Math.sin(dot([st.x, st.y], [12.9898, 78.233])) * 43758.5453123
        );
    }

    updateDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.canvas = this.plasmaBG.current;
        this.ctx = this.canvas.getContext('2d');
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    componentDidUpdate() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "#000000";
        
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (Math.random() > 0.5) {
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    render() {
        return (
            <canvas key="plasma-bg-canvas" id="plasma-bg-canvas" ref={this.plasmaBG} style={{width: "100%", height: "100%"}}></canvas>
        );
    }
}

class PlasmaAnimation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateAnimationState = this.updateAnimationState.bind(this);
    }

    componentDidMount() {
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    updateAnimationState() {
        //this.setState(prevState => ({ angle: prevState.angle + 1 }));
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
    }

    render() {
        return <Plasma />;
    }
}

export default PlasmaAnimation;