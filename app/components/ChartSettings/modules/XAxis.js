import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';

function XAxis({ defaultExpand, options, dataFormat }) {
  const handleXDomain = ({ name }, value) => {
    let domain = options.xDomain || [];
    if ('xDomain.min' === name) {
      domain[0] = value;
    } else if (0 === domain.length) {
      domain = [0, value];
    } else {
      domain[1] = value;
    }
    return { xDomain: domain };
  };

  return (
    <AccordionBlock
      title="X Axis"
      tooltip="Settings for the X axis"
      defaultExpand={defaultExpand}
    >
      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Input"
        fieldProps={{
          label: 'Axis Label',
          name: 'xAxis.axisLabel',
          value: getObjArrayKey(options.xAxis, 'axisLabel'),
        }}
      />

      {'nvd3ScatterMultiSeries' === dataFormat && (<div>
        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Minimum value',
            name: 'xDomain.min',
            type: 'number',
            step: 'any',
            value: getObjArrayKey(options.xDomain, 0),
          }}
          handler={handleXDomain}
        />

        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Maximum value',
            name: 'xDomain.max',
            type: 'number',
            step: 'any',
            value: getObjArrayKey(options.xDomain, 1),
          }}
          handler={handleXDomain}
        />
      </div>)}

      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Input"
        fieldProps={{
          label: 'Height',
          name: 'margin.bottom',
          type: 'number',
          value: getObjArrayKey(options.margin, 'bottom', 50),
        }}
      />

      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Input"
        fieldProps={{
          label: 'Rotate Labels (degrees +/-)',
          name: 'xAxis.rotateLabels',
          type: 'number',
          value: getObjArrayKey(options.xAxis, 'rotateLabels', 0),
        }}
      />

      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Input"
        fieldProps={{
          label: 'Right Margin',
          name: 'margin.right',
          type: 'number',
          value: getObjArrayKey(options.margin, 'right', 0),
        }}
      />
    </AccordionBlock>
  );
}

XAxis.propTypes = {
  options: PropTypes.object.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
  dataFormat: PropTypes.string.isRequired,
};

const mapStateToProps = ({ chartType }) => ({
  dataFormat: chartType.config.dataFormat || '',
});

export default connect(mapStateToProps)(XAxis);
