import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';

const MultibarSettings = ({ options }) => {
  const viewOptions = [
    { value: false, children: 'Grouped' },
    { value: true, children: 'Stacked' },
  ];

  const onDisplayChange = ({ name }, value) => ({ [name]: 'true' === value });

  // TODO:  Get Radio buttons working instead of select
  return (
    <AccordionBlock
      title={'Multibar Settings'}
      tooltip={'Settings for Horizontal Multibar Charts'}
      defaultExpand={false}
    >
      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Select"
        fieldProps={{
          label: 'Chart Display',
          options: viewOptions,
          name: 'stacked',
          value: getObjArrayKey(options, 'stacked', false),
        }}
        handler={onDisplayChange}
      />
    </AccordionBlock>
  );
};

MultibarSettings.propTypes = {
  options: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
});

export default connect(mapStateToProps)(MultibarSettings);
