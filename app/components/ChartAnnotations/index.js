import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actionTrigger from '../../actions';
import {
  RECEIVE_CHART_ANNOTATION,
  RECEIVE_UPDATED_ANNOTATION_DATA,
} from '../../constants';

let svg;
const type = d3v4.annotationCalloutCircle;
// let bboxOld = {};

class ChartAnnotations extends Component {
  static updateStoreAddAnnotation(annotation) {
    this.props.dispatch(actionTrigger(RECEIVE_CHART_ANNOTATION, annotation));
  }

  static onAnnotationDragEnd(data) {
    ChartAnnotations.updateAnnotation(data);
  }

  static renderAnnotations(annotations, editing) {
    svg.select('g.annotations-group').remove();
    const makeAnnotations = d3v4.annotation()
      .type(type)
      .annotations(annotations)
      .editMode(editing)
      .on('dragend', ChartAnnotations.onAnnotationDragEnd);

    svg.append('g')
      .attr('class', 'annotations-group')
      .call(makeAnnotations);
  }

  static updateAnnotation(data) {
    this.props.dispatch(actionTrigger(RECEIVE_UPDATED_ANNOTATION_DATA, data));
  }

  static createAnnotation() {
    const coords = d3v4.mouse(this);

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
      x: coords[0],
      y: coords[1],
      dx: 30,
      dy: -30,
    }];

    ChartAnnotations.updateStoreAddAnnotation(annotations[0]);
  }

  constructor(props) {
    super(props);

    this.state = {
      bbox: {},
    };

    // Adding an annotation
    ChartAnnotations.updateStoreAddAnnotation =
      ChartAnnotations.updateStoreAddAnnotation.bind(this);
    // Updating an annotation
    ChartAnnotations.updateAnnotation =
      ChartAnnotations.updateAnnotation.bind(this);
  }

  componentDidMount() {
    // window.addEventListener('resize', this.updateDimensions);
    // this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    const { editing, chartReady, annotations } = nextProps;
    svg = d3v4.select('.nv-chart svg .nv-barsWrap');
    ChartAnnotations.renderAnnotations(annotations, editing);
    if (editing && chartReady) {
      const { width, height, x, y } = svg.node().getBBox();
      this.setState({ bbox: svg.node().getBBox() });
      const annoCont =
        // TODO: Ugh, this is awful.
        svg.select('.anno-container').node() ?
          svg.select('.anno-container').on('click', null) :
            svg.insert('rect', 'svg > g:not(.nvd3)')
              .attr('class', 'anno-container');

      annoCont
        .attr('class', 'anno-container')
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y)
        .attr('fill', 'transparent')
        .attr('stroke', 'red')
        .attr('stroke-width', '10')
        .attr('stroke-location', 'outside')
        .on('click', ChartAnnotations.createAnnotation);
    }

    if (!editing && chartReady) {
      d3v4.select('.anno-container').remove();
    }
  }

  // componentDidUpdate() {
  //   if (this.props.annotations.length) {
  //     const { width: wNew = 0, height: hNew = 0 } = this.state.bbox;
  //     const { width: wOld = 1, height: hOld = 1 } = bboxOld;

  //     const annotationNodes = d3v4.selectAll('.annotation').nodes();

  //     console.log(wNew, wOld);

  //     if (wNew !== wOld || hNew !== hOld) {
  //       ChartAnnotations.renderAnnotations(
  //         this.props.annotations.map((annotation, index) => ({
  //           ...annotation,
  //           x: ((wNew / wOld) * annotation.x) -
  //             (annotationNodes[index].getBBox().width / 2),
  //           y: (hNew / hOld) * annotation.y,
  //         }))
  //       );
  //     }
  //   }

  //   bboxOld = this.state.bbox;
  // }

  // updateDimensions = () => {
  //   setTimeout(() => {
  //     bboxOld = this.state.bbox;
  //     this.setState({
  //       bbox: d3v4.select('.nv-chart svg .nv-barsWrap').node().getBBox(),
  //     });
  //   }, 175);
  // };

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
  chartReady: PropTypes.bool.isRequired,
  annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => {
  const { editing, annotations } = state.chartAnnotations;
  const { chartReady } = state;
  return { editing, annotations, chartReady };
};

export default connect(mapStateToProps)(ChartAnnotations);
