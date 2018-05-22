import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actionTrigger from '../../actions';
import {
  RECEIVE_CHART_ANNOTATION,
  RECEIVE_UPDATED_ANNOTATION_DATA,
} from '../../constants';
import { getChartTypeDefaultOpts } from '../../utils/chartTypeUtils';

class ChartAnnotations extends Component {
  // Adding an annotation
  static updateStoreAddAnnotation(annotation) {
    this.props.dispatch(actionTrigger(RECEIVE_CHART_ANNOTATION, annotation));
  }

  // Dragging an annotation - update dx/dy when drag ends
  static onAnnotationDragEnd(data) {
    ChartAnnotations.updateAnnotation(data);
  }

  // Render each annotation, getting coordinates for each based on data.
  static renderAnnotations(data, editing, container, selector, getCoords) {
    const annotationsWithCoords = data.map((anno) => ({
      ...anno,
      ...getCoords(anno, selector),
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

  static createAnnotation(data, index) {
    const el = d3v4.select(this);

    const end = 'dot';

    // Basic data for adding annotation.
    // http://d3-annotation.susielu.com/#api
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
      color: 'black',
      data: {
        ...data,
        index,
      },
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

    this.beginRenderingAnnotations();

    // TODO - check if adding without ever removing is wise.
    window.addEventListener('resize', this.repositionAnnotations);
  }

  componentDidUpdate() {
    this.beginRenderingAnnotations();
  }

  componentWillUnmount() {
    const { svgEl } = this.state;
    this.beginRenderingAnnotations(false);
    svgEl.selectAll(this.props.selector).on('click', null);
  }

  beginRenderingAnnotations(isEditing = null) {
    const {
      annotationData: data,
      container,
      selector,
      getCoords,
    } = this.props;

    const editing = null !== isEditing ? isEditing : this.props.editing;

    ChartAnnotations
      .renderAnnotations(data, editing, container, selector, getCoords);
  }

  repositionAnnotations = () => {
    setTimeout(() => {
      this.beginRenderingAnnotations();
    }, 350);
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
  annotationData: PropTypes.arrayOf(PropTypes.object).isRequired,
  selector: PropTypes.string.isRequired,
  container: PropTypes.string.isRequired,
  getCoords: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  chartAnnotations = {}, chartReady, data = {},
}, props) => {
  const { annotations } = getChartTypeDefaultOpts(props.type);
  if (!props.widget) {
    const { editing, annotationData } = chartAnnotations;
    const {
      selector,
      container,
      getCoords,
    } = annotations;
    return {
      chartReady,
      editing,
      annotationData,
      selector,
      container,
      getCoords,
    };
  }

  return { ...props, ...annotations, chartReady: data.chartReady };
};

export default connect(mapStateToProps)(ChartAnnotations);
