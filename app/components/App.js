import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataInput from './DataInput';
import ChartEditor from './ChartEditor';
import Header from './Header';
import Help from './Help';
import * as rebassHover from '../styles/RebassHover.css'; // eslint-disable-line no-unused-vars
import { appCover } from '../styles/App.css';

class App extends Component {

  constructor() {
    super();
    this._renderAppComponent = this._renderAppComponent.bind(this);
    this._firstParsedCol = this._firstParsedCol.bind(this);
  }

  componentDidMount() {
    this._captureClicks(this.props.state.cmsStatus);
  }

  componentDidUpdate() {
    this._captureClicks(this.props.state.cmsStatus);
  }

  /**
   * Overlay should capture all clicks to prevent interaction
   * with the editor while the CMS parent page is saving
   */
  _captureClicks(cmsStatus) {
    if ('cms.isSaving' === cmsStatus) {
      const cover = document.getElementById('appCover');
      if (cover) {
        cover.addEventListener('click', (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
        });
      }
    }
  }

  _firstParsedCol() {
    const firstColKey = this.props.state.dataFields[0];
    return this.props.state.parsedData.map((row) => row[firstColKey]);
  }

  _renderAppComponent() {
    if (0 === this.props.state.currentStep) {
      return React.createElement(DataInput, {
        metadata: this.props.state.chartMetadata,
        rawData: this.props.state.rawData,
        dataStatus: this.props.state.dataStatus,
        dateFormat: this.props.state.dateFormat,
        firstCol: this._firstParsedCol(),
      });
    }
    return React.createElement(ChartEditor, {
      appState: this.props.state,
    });
  }

  render() {
    return (
      // set height 100% so child divs inherit it
      <div style={{ height: '100%' }}>
        <Header
          currentStep={this.props.state.currentStep}
          unsavedChanges={this.props.state.unsavedChanges}
          errorCode={this.props.state.errorCode}
          cmsStatus={this.props.state.cmsStatus}
        />
        {this._renderAppComponent()}
        <Help docName={this.props.state.helpDocument} />
        { 'cms.isSaving' !== this.props.state.cmsStatus ? null :
          (<div id="appCover" className={appCover} />)
        }
      </div>
    );
  }
}

App.propTypes = {
  state: React.PropTypes.object,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({ state })
)(App);
