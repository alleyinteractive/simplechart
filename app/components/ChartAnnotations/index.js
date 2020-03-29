/* eslint-disable import/no-duplicates */
import React, { Component } from 'react';
import {
  annotation as d3Annotation,
  annotationCalloutElbow,
} from 'd3-svg-annotation';
import * as d3Anno2 from 'd3-svg-annotation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actionTrigger from '../../actions';
import {
  RECEIVE_CHART_ANNOTATION,
  RECEIVE_UPDATED_ANNOTATION_DATA,
} from '../../constants';
import { getChartTypeDefaultOpts } from '../../utils/chartTypeUtils';
import * as d3v4 from '../../vendor/d3v4';

import './ChartAnnotations.css';

class ChartAnnotations extends Component {
  // Adding an annotation
  static updateStoreAddAnnotation(annotation) {
    this.props.dispatch(actionTrigger(RECEIVE_CHART_ANNOTATION, annotation));
  }

  // Dragging an annotation - update dx/dy when drag ends
  static onAnnotationDragEnd(data, container) {
    ChartAnnotations.updateAnnotation({
      ...data,
      ...ChartAnnotations.constrainAnnotation(data, container),
    });
  }

  // Ensure annotations remain inside the chart container
  static constrainAnnotation(annotation, container) {
    // Hide all but current annotation
    // Avoiding arrow syntax due to need to preserve `this` for d3 selection
    d3v4.selectAll(`${container} .annotation`).each(function (data, index) {
      if (index !== annotation.id) {
        d3v4.select(this).style('display', 'none');
      }
    });
    const { dx, dy } = annotation;
    if (!d3v4.select(`${container}`).node()) {
      return { dx, dy };
    }

    const wrapBBox = d3v4.select(`${container} .nv-wrap`).node().getBBox();
    const containerBBox = d3v4.select(`${container}`).node().getBBox();
    const hDiff = wrapBBox.height - containerBBox.height;
    const wDiff = wrapBBox.width - containerBBox.width;
    const xAdjust = 0 > dx ? Math.abs(wDiff) : wDiff;
    const yAdjust = 0 > dy ? Math.abs(hDiff) : hDiff;

    // Avoiding arrow syntax due to need to preserve `this` for d3 selection
    d3v4.selectAll(`${container} .annotation`).each(function () {
      d3v4.select(this).style('display', 'inline');
    });

    return {
      dx: dx + xAdjust,
      dy: dy + yAdjust,
    };
  }

  // Render each annotation, getting coordinates for each based on data.
  static renderAnnotations(data, editing, container, selector, getCoords) {
    const annotationsWithCoords = data.map((anno) => ({
      ...anno,
      ...getCoords(anno, selector),
    })).map((anno) => {
      const constrained =
        !editing ? ChartAnnotations.constrainAnnotation(anno, container) : {};
      return {
        ...anno,
        ...constrained,
      };
    });

    const containerEl = d3v4.select(container);
    containerEl.select('g.annotations-group').remove();
    // const makeAnnotations = d3v4.annotation()
    // .type(d3v4.annotationCalloutElbow)
    const makeAnnotations = d3Annotation()
      .type(annotationCalloutElbow)
      .annotations(annotationsWithCoords)
      .editMode(editing)
      .on('dragend', (annotation) =>
        ChartAnnotations.onAnnotationDragEnd(annotation, container)
      );

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
      className: '',
      connector: { end },
      hideConnector: false,
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
      svgEl: d3v4.select('.nv-chart svg'),
      mobile: 500 > window.innerWidth,
      showAnnotations: true,
      editing: props.editing,
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
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
    // This component can become unmounted after editing.
    // Annotations are still rendered on window resize, however.
    // We need a way to let the code know this component has been unmounted
    // From:
    // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._isMounted = true; // eslint-disable-line no-underscore-dangle
  }

  componentDidUpdate() {
    this.beginRenderingAnnotations();
  }

  componentWillUnmount() {
    const { svgEl } = this.state;
    this.beginRenderingAnnotations(false);
    svgEl.selectAll(this.props.selector).on('click', null);
    this._isMounted = false; // eslint-disable-line no-underscore-dangle
  }

  beginRenderingAnnotations(isEditing = null) {
    const {
      container,
      selector,
      getCoords,
    } = this.props;

    const data = this.state.showAnnotations ? this.props.annotationData : [];

    const editing =
      (null !== isEditing ? isEditing : this.props.editing) && this._isMounted; // eslint-disable-line no-underscore-dangle

    ChartAnnotations
      .renderAnnotations(data, editing, container, selector, getCoords);
  }

  handleWindowResize = () => {
    const { widget } = this.props;
    const mobile = 500 > window.innerWidth;

    this.repositionAnnotations();

    // If we are not rendering in the widget, we don't need to worry about toggling
    if (!widget) {
      return;
    }

    const toggleNode = document.querySelector(this.props.widget);

    this.setState({
      mobile,
      showAnnotations: !mobile ? true : this.state.showAnnotations,
    });

    if (mobile) {
      toggleNode.addEventListener('click', this.toggleAnnotations);
    } else {
      toggleNode.removeEventListener('click', this.toggleAnnotations);
    }
  }

  toggleAnnotations = () => {
    this.setState({
      showAnnotations: !this.state.showAnnotations,
    });
    if (this.state.showAnnotations) {
      this.beginRenderingAnnotations();
    }
  }

  repositionAnnotations = () => {
    setTimeout(() => {
      this.beginRenderingAnnotations();
    }, 350);
  };

  render() {
    const { editing } = this.props;
    const { mobile } = this.state;

    return (
      <div>
        {
          editing && <h5>Click Chart To Add Annotations</h5>
        }
        {
          mobile && <span>Click The Chart to Toggle Annotations</span>
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
  widget: PropTypes.string.isRequired,
  getCoords: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  chartAnnotations = {}, chartReady, chartRendering, data = {},
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
      chartRendering,
      editing,
      annotationData,
      selector,
      container,
      getCoords,
      widget: '',
    };
  }

  return {
    ...props,
    ...annotations,
    selector: `#${props.widget} ${annotations.selector}`,
    container: `#${props.widget} ${annotations.container}`,
    chartReady: data.chartReady,
    editing: false,
    widget: `#${props.widget}`,
  };
};

export default connect(mapStateToProps)(ChartAnnotations);
