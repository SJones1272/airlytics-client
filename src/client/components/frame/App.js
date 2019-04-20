import React, {Component} from 'react';
import Header from "./header";
import Visual from "../visual/visual";
import data from "./airline-data"
import axios from "axios";

class App extends Component {

    constructor(props) {
        super(props);

        this.data = {
            airlines: data
        };

        this.initialState = {
            layout: 'ranking',
            airline: '',
            x: 32,
            y: 5,
            z: 8,
            a: 0,
            showAbout: false,
            isHovering: false,
            activeVisual: "ranking",
            activeAirline: "american-airlines"
        };

        this.state = Object.assign({}, this.initialState);

        this.visual = new Visual({
            setState: this.setState.bind(this),
        });
    }


    async componentDidMount() {
        this.visual.load(this.data);
        this.visual.start();
        window.addEventListener('resize', () => {
            this.forceUpdate();
        });

        this.refreshVisual();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState !== this.state &&
            (this.state.x !== prevState.x ||
                this.state.y !== prevState.y ||
                this.state.z !== prevState.z ||
                this.state.a !== prevState.a ||
                this.state.layout !== prevState.layout)
        ) {
            this.refreshVisual();
        }

        this.refreshAirline();

    }

    refreshVisual() {
        switch (this.state.layout) {
            case 'ranking':
                this.visual.composer.setSize(0.25);
                this.visual.setLayout('ranking');
                break;
            case 'airline':
                this.visual.composer.setSize(0.25);
                this.visual.setLayout('airline', {
                    airline: this.state.activeAirline
                });
                break;
            case 'data':
                this.visual.composer.setSize(0.25);
                this.visual.setLayout('data');
            default:
                console.error('layout not found', this.state.layout);
        }
    }

    refreshAirline() {
        this.visual.setAirline(this.state.airline);
    }

    setActive = (topic) => {
        this.setState({
            activeVisual: topic,
            layout: topic
        });
    };


    render() {
       if(this.state.isHovering) {
           console.log(this.state.key);
           console.log(this.state.airline);
           console.log(this.state.value);
       }
        return (
            <div className="app">

                <Header setActive={this.setActive} activeVisual={this.state.activeVisual}/>
                {this.state.activeVisual === 'ranking' ?
                    <div>
                        <div
                            className="label-x"
                        >
							<span
                                className="left icon-arrow-simple"
                                onClick={() => {
                                    alert("left")
                                }}
                            />
                            <span
                                className="title"
                                style={{
                                    maxWidth: window.innerWidth - 100,
                                }}
                            >
								Ranking
							</span>
                            <span
                                className="right icon-arrow-simple"
                                onClick={() => {
                                    alert("right")
                                }}
                            />
                        </div>
                    </div> : <div></div>}

                {this.state.activeVisual === 'data' ?
                    <div>
                        <div
                            className="label-x"
                        >
							<span
                                className="left icon-arrow-simple"
                                onClick={() => {
                                    alert("left")
                                }}
                            />
                            <span
                                className="title"
                                style={{
                                    maxWidth: window.innerWidth - 100,
                                }}
                            >
								Feature 2
							</span>
                            <span
                                className="right icon-arrow-simple"
                                onClick={() => {
                                    alert("right")
                                }}
                            />
                        </div>
                        <div
                            className="label-y"
                            style={{
                                right:
                                    window.innerWidth / 2 - 50
                            }}
                        >
							<span
                                className="left icon-arrow-simple"
                                onClick={() => {
                                    alert("left")
                                }}

                            />
                            <span
                                className="title"
                                style={{
                                    maxWidth: window.innerWidth - 100,
                                }}
                            >
								Feature 1
							</span>
                            <span
                                className="right icon-arrow-simple"
                                onClick={() => {
                                    alert("right")
                                }}
                            />
                        </div>
                    </div> : <div></div>}


            </div>
        );
    }
}

export default App;
