import React, { Component } from 'react';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_METADATA,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';
import update from 'react-addons-update';

class Metadata extends Component {
  constructor() {
    super();
    this._handler = this._handler.bind(this);
    this.state = {
      title: '',
      caption: '',
      credit: '',
    };
  }

  componentWillMount() {
    this.setState(this.props.metadata);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.metadata);
  }

  _capitalize(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  _handler(fieldProps, value) {
    const theUpdate = {
      [fieldProps.name]: value,
    };

    // setState() is async so we also need to return copy with update()
    this.setState(theUpdate);
    return update(this.state, { $merge: theUpdate });
  }

  render() {
    return (
      <AccordionBlock
        title="Metadata"
        tooltip="Title, caption, credit"
        defaultExpand={this.props.defaultExpand}
      >
        {Object.keys(this.state).map((key) =>
          (
            <div key={`metadata-${key}`}>
              <DispatchField
                action={RECEIVE_CHART_METADATA}
                fieldType="Input"
                fieldProps={{
                  label: this._capitalize(key),
                  name: key,
                  value: getObjArrayKey(this.state, key, ''),
                }}
                handler={this._handler}
              />
            </div>
          )
        )}
      </AccordionBlock>
    );
  }
}

Metadata.propTypes = {
  metadata: React.PropTypes.object,
  defaultExpand: React.PropTypes.bool,
};

export default Metadata;
