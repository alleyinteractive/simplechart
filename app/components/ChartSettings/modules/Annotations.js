import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    // New setting pane for annotations.
    // When items here are changed, the store is updated and
    // all annotations are re-rendered
    const { editing, annotationData } = this.props;
    const editingString = editing ?
      'Finish Editing' : 'Edit Annotations';
    return (
      <div>
        {
          annotationData.map((item, index) => (
            <AccordionBlock
              key={item.id}
              title={`Annotation ${index + 1}`}
              tooltip={`Settings for Annotation ${index + 1}`}
              defaultExpand={false}
            >
              <DispatchField
                fieldType="Input"
                fieldProps={{
                  disabled: !editing,
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
                  disabled: !editing,
                  label: 'Annotation Label',
                  name: `${index}.label`,
                  value: item.note.label,
                }}
                handler={(fieldProps, newValue) => {
                  this.handleLabelChange(item, newValue);
                }}
              />
              {
                editing && <Button
                  theme="error"
                  onClick={() => this.onRemoveClick(index)}
                >
                  Remove
                </Button>
              }
            </AccordionBlock>
          ))
        }
        {
          !editing && <p>
            To add, remove, and updating existing annotations, click Edit below.
          </p>
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
  dispatch: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  annotationData: PropTypes.array.isRequired,
};

const mapStateToProps = ({ chartAnnotations: { editing, annotationData } }) => (
  { editing, annotationData }
);

export default connect(mapStateToProps)(Annotations);
