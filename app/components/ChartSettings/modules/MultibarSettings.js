import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'rebass';
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

  return (
    <AccordionBlock
      title={'Multibar Settings'}
      tooltip={'Settings for Horizontal Multibar Charts'}
      defaultExpand={false}
    >
      <Label htmlFor="stacked">
        Chart Display
      </Label>
      {
        viewOptions.map((option) => (
          <DispatchField
            action={RECEIVE_CHART_OPTIONS}
            fieldType="Radio"
            fieldProps={{
              label: option.children,
              name: 'stacked',
              value: option.value,
              checked: (option.value === getObjArrayKey(options, 'stacked', false)),
              backgroundColor: 'primary',
            }}
            handler={onDisplayChange}
          />
        ))
      }
    </AccordionBlock>
  );
};

MultibarSettings.propTypes = {
  options: PropTypes.object.isRequired,
};

export default connect()(MultibarSettings);
