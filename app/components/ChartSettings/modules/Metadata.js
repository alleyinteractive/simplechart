import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_METADATA,
} from '../../../constants';
import { getObjArrayKey, capitalize } from '../../../utils/misc';

export default class Metadata extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired,
    defaultExpand: PropTypes.bool.isRequired,
  };

  state = {
    title: '',
    caption: '',
    credit: '',
    subtitle: '',
  };

  componentWillMount() {
    this.setState(this.props.metadata);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.metadata);
  }

  handler = (fieldProps, value) => {
    const theUpdate = {
      [fieldProps.name]: value,
    };

    // setState() is async so we also need to return copy with update()
    this.setState(theUpdate);
    return update(this.state, { $merge: theUpdate });
  };

  render() {
    return (
      <AccordionBlock
        title="Metadata"
        tooltip="Title, subtitle, caption, credit"
        defaultExpand={this.props.defaultExpand}
      >
        {Object.keys(this.state).map((key) =>
          (
            <div key={`metadata-${key}`}>
              <DispatchField
                action={RECEIVE_CHART_METADATA}
                fieldType="Input"
                fieldProps={{
                  label: capitalize(key),
                  name: key,
                  value: getObjArrayKey(this.state, key, ''),
                }}
                handler={this.handler}
              />
            </div>
          )
        )}
      </AccordionBlock>
    );
  }
}
