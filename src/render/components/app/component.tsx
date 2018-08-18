import './component.styl';
import * as React from 'react';

export default class App extends React.Component {
    render() {
        return <div className="App">
            <header className="App-header">
                <img src="./image/logo.svg" className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
                To get started, edit <code>src/App.tsx</code> and save to reload.
            </p>
        </div>;
    }
}
