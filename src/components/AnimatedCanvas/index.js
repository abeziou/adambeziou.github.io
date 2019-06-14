import React from 'react';
import tvstatic from '../BackgroundDemos/tvstatic.js';

class AnimatedCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        console.log("test");

        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext('2d');

        requestAnimationFrame(this.draw);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    draw = () => {
        requestAnimationFrame(this.draw);

		tvstatic(this.canvas, this.ctx, 2);
    }

    render() {
        console.log("render");
        return (
            <canvas ref={this.canvasRef} style={{width: "100%", height: "100%"}}></canvas>
        );
    }
}

export default AnimatedCanvas;