import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Button, Panel, PanelHeader, PanelFooter, Switch } from 'rebass';
import { Button, Divider } from 'rebass';
import { connect } from 'react-redux';
import AccordionBlock from '../../Layout/AccordionBlock';
import actionTrigger from '../../../actions';
import DispatchField from '../../lib/DispatchField';
import {
  EDITING_CHART_ANNOTATIONS,
  RECEIVE_REMOVE_ANNOTATION,
  RECEIVE_UPDATED_ANNOTATION_DATA,
} from '../../../constants';

class Annotations extends Component {
  onRemoveClick = (index) => {
    this.props.dispatch(actionTrigger(RECEIVE_REMOVE_ANNOTATION, index));
  }

  onEditClick = () => {
    const { dispatch, editing } = this.props;
    dispatch(actionTrigger(EDITING_CHART_ANNOTATIONS, !editing));
  };

  handleTitleChange = (item, newValue) => {
    const { dispatch } = this.props;
    dispatch(actionTrigger(RECEIVE_UPDATED_ANNOTATION_DATA, {
      ...item,
      note: {
        ...item.note,
        title: newValue,
      },
    }));
  }

  handleLabelChange = (item, newValue) => {
    const { dispatch } = this.props;
    dispatch(actionTrigger(RECEIVE_UPDATED_ANNOTATION_DATA, {
      ...item,
      note: {
        ...item.note,
        label: newValue,
      },
    }));
  }

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
              <DispatchField
                fieldType="Input"
                fieldProps={{
                  label: 'Annotation Title',
                  name: `${index}.title`,
                  value: item.note.title,
                }}
                handler={(fieldProps, newValue) => {
                  this.handleTitleChange(item, newValue);
                }}
              />
              <DispatchField
                fieldType="Input"
                fieldProps={{
                  label: 'Annotation Label',
                  name: `${index}.label`,
                  value: item.note.label,
                }}
                handler={(fieldProps, newValue) => {
                  this.handleLabelChange(item, newValue);
                }}
              />
              <Button
                theme="error"
                onClick={() => this.onRemoveClick(index)}
              >
                Remove
              </Button>
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
  // TODO: remove if not using
  // defaultExpand: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  annotations: PropTypes.array.isRequired,
};

const mapStateToProps = ({ chartAnnotations: { editing, annotations } }) => (
  { editing, annotations }
);

export default connect(mapStateToProps)(Annotations);
