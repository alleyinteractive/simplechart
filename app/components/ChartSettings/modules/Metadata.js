import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_METADATA,
} from '../../../constants';
import { getObjArrayKeyStringOnly, capitalize } from '../../../utils/misc';

export default class Metadata extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired,
    defaultExpand: PropTypes.bool.isRequired,
  };

  state = {
    title: '',
    source: '',
    notes: '',
    subtitle: false,
  };

  /* eslint-disable react/sort-comp */
  shouldShowMetadata = {
    title: true,
    source: true,
    notes: true,
    subtitle: false,
  }
  /* eslint-enable react/sort-comp */

  metaKeyFallback = {
    source: 'credit',
    notes: 'caption',
  };

  componentWillMount() {
    this.setState(this.props.metadata);
    if ('undefined' !== typeof this.props.metadata.subtitle &&
      ('' === this.props.metadata.subtitle || this.props.metadata.subtitle)
    ) {
      this.shouldShowMetadata.subtitle = true;
    }
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
        tooltip="Title and other metadata fields"
        defaultExpand={this.props.defaultExpand}
      >
        {Object.keys(this.state).map((key) => {
          if (this.shouldShowMetadata[key]) {
            return (
              <div key={`metadata-${key}`}>
                <DispatchField
                  action={RECEIVE_CHART_METADATA}
                  fieldType="Input"
                  fieldProps={{
                    label: capitalize(key),
                    name: key,
                    value: this.metaKeyFallback[key] ?
                      getObjArrayKeyStringOnly(this.state, key, '') ||
                      getObjArrayKeyStringOnly(
                        this.state,
                        this.metaKeyFallback[key],
                        ''
                      ) : getObjArrayKeyStringOnly(this.state, key, ''),
                  }}
                  handler={this.handler}
                />
              </div>
            );
          }
          return '';
        })}
      </AccordionBlock>
    );
  }
}
