import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';

class SaveChart extends Component {
  constructor() {
    super();
    this._sendToParent = this._sendToParent.bind(this);
    this.state = {};
  }

  _sendToParent() {
    const saveData = update(this.props.state, { $apply: (state) =>
      ({
        rawData: state.rawData,
        chartData: state.chartData,
        chartMetadata: state.chartMetadata,
        chartOptions: state.chartOptions,
      }),
    });

    /**
     * @todo send postMessage to parent window
     */
    console.log(saveData);

    this.setState({ sent: true });
  }

  render() {
    return (
      <div>
        <button onClick={this._sendToParent}>
          Save Chart
        </button>
        <span>
          {this.state.sent ?
            'Chart saved!' :
            ''
          }
        </span>
      </div>
    );
  }
}

SaveChart.propTypes = {
  state: React.PropTypes.object,
};

export default connect()(SaveChart);
