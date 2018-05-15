import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actionTrigger from '../../actions';
import {
  RECEIVE_CHART_ANNOTATION,
  RECEIVE_UPDATED_ANNOTATION_DATA,
} from '../../constants';

class ChartAnnotations extends Component {
  static updateStoreAddAnnotation(annotation) {
    this.props.dispatch(actionTrigger(RECEIVE_CHART_ANNOTATION, annotation));
  }

  static onAnnotationDragEnd(data) {
    ChartAnnotations.updateAnnotation(data);
  }

  static renderAnnotations(annotations, editing, container, getCoords) {
    const annotationsWithCoords = annotations.map((anno) => ({
      ...anno,
      ...getCoords(anno.el),
    }));

    const containerEl = d3v4.select(container);
    containerEl.select('g.annotations-group').remove();
    const makeAnnotations = d3v4.annotation()
      .type(d3v4.annotationCalloutElbow)
      .annotations(annotationsWithCoords)
      .editMode(editing)
      .on('dragend', ChartAnnotations.onAnnotationDragEnd);

    containerEl.append('g')
      .attr('class', 'annotations-group')
      .call(makeAnnotations);
  }

  static updateAnnotation(data) {
    this.props.dispatch(actionTrigger(RECEIVE_UPDATED_ANNOTATION_DATA, data));
  }

  static createAnnotation() {
    const el = d3v4.select(this);

    const end = 'dot';

    const annotations = [{
      note: {
        label: `Label ${(Math.random() * 100).toFixed()}`,
        title: 'Title',
        wrap: 120,
        align: 'middle',
      },
      subject: {
        radius: 10,
      },
      connector: { end },
      dx: 30,
      dy: -30,
      el,
    }];

    ChartAnnotations.updateStoreAddAnnotation(annotations[0]);
  }

  constructor(props) {
    super(props);

    this.state = {
      bbox: {},
      svgEl: d3v4.select('.nv-chart svg'),
    };

    // Adding an annotation
    ChartAnnotations.updateStoreAddAnnotation =
      ChartAnnotations.updateStoreAddAnnotation.bind(this);
    // Updating an annotation
    ChartAnnotations.updateAnnotation =
      ChartAnnotations.updateAnnotation.bind(this);
  }

  componentDidMount() {
    const { svgEl } = this.state;

    svgEl.selectAll(this.props.selector)
    .on('click', ChartAnnotations.createAnnotation);

    const { annotations, editing, container, getCoords } = this.props;
    ChartAnnotations
      .renderAnnotations(annotations, editing, container, getCoords);

    // TODO - check if adding without ever removing is wise.
    window.addEventListener('resize', this.repositionAnnotations);
  }

  componentWillReceiveProps(nextProps) {
    const { annotations, editing, container, getCoords } = nextProps;
    ChartAnnotations
      .renderAnnotations(annotations, editing, container, getCoords);
  }

  componentDidUpdate() {
    const { annotations, editing, container, getCoords } = this.props;
    ChartAnnotations
      .renderAnnotations(annotations, editing, container, getCoords);
  }

  componentWillUnmount() {
    const { svgEl } = this.state;
    const { annotations, container, getCoords } = this.props;
    ChartAnnotations
      .renderAnnotations(annotations, false, container, getCoords);
    svgEl.selectAll(this.props.selector).on('click', null);
  }

  repositionAnnotations = () => {
    setTimeout(() => {
      const { annotations, editing, container, getCoords } = this.props;
      ChartAnnotations
        .renderAnnotations(annotations, editing, container, getCoords);
    }, 250);
  };

  render() {
    const { editing } = this.props;
    return (
      <div>
        {
          editing && <h5>Click Chart To Add Annotations</h5>
        }
      </div>
    );
  }
}

ChartAnnotations.propTypes = {
  dispatch: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
  selector: PropTypes.string.isRequired,
  container: PropTypes.string.isRequired,
  getCoords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { editing, annotations } = state.chartAnnotations;
  const {
    chartType: {
      config: {
        annotations: {
          selector,
          container,
          getCoords,
        },
      },
    },
  } = state;
  return {
    editing,
    annotations,
    selector,
    container,
    getCoords,
  };
};

export default connect(mapStateToProps)(ChartAnnotations);
