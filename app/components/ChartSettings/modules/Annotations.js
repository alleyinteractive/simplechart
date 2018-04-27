import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Button, Panel, PanelHeader, PanelFooter, Switch } from 'rebass';
import { Button, Divider } from 'rebass';
import { connect } from 'react-redux';
import AccordionBlock from '../../Layout/AccordionBlock';
import actionTrigger from '../../../actions';
import { EDITING_CHART_ANNOTATIONS } from '../../../constants';

class Annotations extends Component {
  onEditClick = () => {
    const { dispatch, editing } = this.props;
    dispatch(actionTrigger(EDITING_CHART_ANNOTATIONS, !editing));
  };

  render() {
    const editingString = this.props.editing ?
      'Finish Editing' : 'Edit Annotations';
    return (
      <div>
        {
          this.props.annotations.map((item, index) => (
            <AccordionBlock
              title={`Annotation ${index + 1}`}
              tooltip={`Settings for Annotation ${index + 1}`}
            >
              {/* <DispatchField
                fieldType="Checkbox"
                fieldProps={{
                  label: 'Locked',
                  name: `${index}.locked`,
                  checked: false,
                }}
                handler={() => {}}
              /> */}
              <p><strong>{item.note.title}</strong></p>
              <p>{item.note.label}</p>
              <Button theme="error">Remove</Button>
            </AccordionBlock>
          ))
        }
        <Button big theme="success" onClick={this.onEditClick}>
          {editingString}
        </Button>
        <Divider />
      </div>
    );
  }
}

Annotations.propTypes = {
  // defaultExpand: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  annotations: PropTypes.array.isRequired,
};

const mapStateToProps = ({ chartAnnotations: { editing, annotations } }) => (
  { editing, annotations }
);

export default connect(mapStateToProps)(Annotations);
