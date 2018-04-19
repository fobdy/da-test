import NetworkMap from '../NetworkMap';
import React, { Component } from 'react';

import styled from 'styled-components';
import sampleData from '../data/converted.json';

const FlexContainer = styled.div`
  display: flex;
  align-content: stretch;
  min-height: 100vh;
`;

const FlexItem = styled.div`
  display: flex;
  flex: 1;
`;

class App extends Component {
  state = {
    points: null
  }

  _setDidMountListener = clb => {
    this._onMount = clb;
  };

  componentDidMount() {
    if (typeof this._onMount === 'function')
      this._onMount();
    // const points = await fetch(process.env.PUBLIC_URL + '/da-test/converted.json')
    //   .then(resp => resp.json());
    this.setState({ points: sampleData });
  }

  render() {
    return (
      <FlexContainer>
        <FlexItem>
          <NetworkMap
            setDidMountListener={this._setDidMountListener}
            points={this.state.points} />
        </FlexItem>
      </FlexContainer>
    );
  }
}

export default App;
