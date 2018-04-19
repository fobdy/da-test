import NetworkMap from '../NetworkMap';
import React, { Component } from 'react';

import styled from 'styled-components';

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

  async componentDidMount() {
    if (typeof this._onMount === 'function')
      this._onMount();
    const points = await fetch('/converted.json')
      .then(resp => resp.json());
    this.setState({ points });
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
