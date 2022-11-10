import './Loading.css';
import React from 'react';

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true,
            ts: 0
        }

        this.canvasRef = React.createRef();

        this.initCanvas = this.initCanvas.bind(this);
        this.getPoints = this.getPoints.bind(this);
        this.drawPoints = this.drawPoints.bind(this);
        this.frame = this.frame.bind(this);

        this.ts = 0;

        //line constants
        this.lineLength = 80;
        this.lineWidth = 3;
        this.buffer = 10;
        this.framesPerLoop=60;

        //circle constants
        this.radius = 5;
    }

    componentDidMount(){
        setInterval(this.frame(), 16);
    }

    frame(){
        let { loading, ts } = this.state;
        console.log(this.state);
        console.log("ran");
        this.drawPoints(ts);
        this.setState({ ts: ts+1 });
    }

    componentDidUpdate(){
        let { loading, ts } = this.state;
        if(ts < 10){
            this.frame();
        }
    }

    initCanvas(){
        let points = this.drawPoints(0);

        //triangle constants
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const buffer = this.buffer;
        const lineLength = this.lineLength;
        let height = Math.sin(Math.PI/3)*this.lineLength;        
        
        let radius = this.radius;

        //draw triangle
        // ctx.strokeStyle = "#C5A562";
        // ctx.lineWidth = this.lineWidth;
        // ctx.shadowBlur=10;
        // ctx.shadowColor="#C5A562";
        // ctx.beginPath();
        // ctx.moveTo(buffer, buffer+height);
        // ctx.lineTo(buffer+(lineLength/2), buffer);
        // ctx.lineTo(buffer+lineLength, buffer+height);
        // ctx.lineTo(buffer, buffer+height);
        // ctx.stroke();

        //draw circles
        // ctx.beginPath();
        // ctx.strokeStyle = "#C5A562";
        // ctx.lineWidth = this.lineWidth;
        // ctx.shadowBlur=10;
        // ctx.shadowColor="#C5A562";

        // ctx.arc(buffer, buffer+height, radius, 0, Math.PI*2);
        // ctx.moveTo(buffer+(lineLength/2), buffer);
        // ctx.arc(buffer+(lineLength/2), buffer, radius, 0, Math.PI*2);
        // ctx.moveTo(buffer+lineLength, buffer+height);
        // ctx.arc(buffer+lineLength, buffer+height, radius, 0, Math.PI*2);

        // ctx.stroke();
    }

    drawPoints(timeStep){
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        let points = this.getPoints(timeStep); 
        console.log(points);

        //draw lines
        ctx.strokeStyle = "#C5A562";
        ctx.lineWidth = this.lineWidth;
        ctx.shadowBlur=10;
        ctx.shadowColor="#C5A562";
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.lineTo(points[0][0], points[0][1]);
        ctx.stroke();

        //draw circles
        ctx.strokeStyle = "#C5A562";
        ctx.lineWidth = this.lineWidth;
        ctx.shadowBlur=10;
        ctx.shadowColor="#C5A562";

        points.forEach(point => {
            // ctx.moveTo(point[0], point[1]);
            ctx.beginPath();
            ctx.arc(point[0], point[1], this.radius, 0, Math.PI*2);
            ctx.stroke();
        });
    }

    getPoints(timeStep){
        const framesPerLoop = this.framesPerLoop;
        let currentStep = timeStep%framesPerLoop;
        let height = Math.sin(Math.PI/3)*this.lineLength; 
        const buffer = this.buffer;
        const lineLength = this.lineLength;       

        //point 1
        let startX1 = 0;
        let startY1 = height;
        let dx1 = (lineLength/2)/framesPerLoop * currentStep;
        console.log(lineLength/2);
        console.log(timeStep);
        let dy1 = 2*Math.sin(Math.PI/3) * dx1;
        let point1 = [(buffer + startX1 + dx1), (buffer + startY1 - dy1)];

        //point 2
        let startX2 = lineLength/2;
        let startY2 = 0;
        let dx2 = ((lineLength/2)/framesPerLoop * currentStep);
        let dy2 = 2*Math.sin(Math.PI/3) * dx2;
        let point2 = [(buffer + startX2 + dx2), (buffer + startY2 + dy2)];

        //point 3
        let startX3 = lineLength;
        let startY3 = height;
        let dx3 = (lineLength/framesPerLoop) * currentStep;
        let dy3 = 0;
        let point3 = [(buffer + startX3 - dx3), (buffer + startY3)];

        return [point1, point2, point3];
    }

    render(){
        return (
            <canvas id="loadingContainer" width="100px" height="100px" ref={this.canvasRef}>

            </canvas>
        );
    }
}

export default Loading;
