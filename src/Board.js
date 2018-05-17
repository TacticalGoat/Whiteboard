import React from 'react'
import Immutable from 'immutable'

class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isDrawing: false,
            lines: new Immutable.List(),
        };
    }

    componentDidMount(){
        document.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    componentWillUnmount(){
        document.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    
    handleMouseDown(mouseEvent) {
        console.log("mouseDown");
        if (mouseEvent.button !== 0){
            return;
        }

        const point = this.relativeCoordinatesFromEvent(mouseEvent);
        console.log(point.get('x'));
        this.setState(
            prevState => {
                return({
                    lines: prevState.lines.push(new Immutable.List([point])),
                    isDrawing: true,
                });
            }
        );
    }

    handleMouseMove(mouseEvent) {
        if(!this.state.isDrawing){
            return;
        }
        console.log("Drawing DrawingLine");
        const point = this.relativeCoordinatesFromEvent(mouseEvent);

        this.setState(
            prevState => {
                return({
                    lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
                });
            }
        )
    }

    handleMouseUp(){
        this.setState({isDrawing: false});
    }

    relativeCoordinatesFromEvent(mouseEvent){
        const boundingRect = this.refs.board.getBoundingClientRect();
        return new Immutable.Map({
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        });
    }

    render(){
        return(
            <div
                className="board" 
                ref="board" 
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)} 
            >
                <Drawing lines={this.state.lines}/>
            </div>
        )
    }
}

function Drawing({lines}){
    return(
        <svg className="svg">
            {
                lines.map((line, index) => {
                    return <DrawingLine key={index} line={line}/>
                })
            }
        </svg>
    );
}

function DrawingLine({line}){
    //console.log(line[0].get('x'));
    const pathData = "M" +
        line
            .map(p =>{
                return `${p.get("x")}  ${p.get("y")}`;
            })
            .join("L");
    return <path className="path" d={pathData} />
}

export default Board;