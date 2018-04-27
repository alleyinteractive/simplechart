import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actionTrigger from '../../actions';
import { RECEIVE_CHART_ANNOTATION } from '../../constants';

let svg;
const type = d3v4.annotationCalloutCircle;

class ChartAnnotations extends Component {
  static updateStoreAddAnnotation(annotation) {
    this.props.dispatch(actionTrigger(RECEIVE_CHART_ANNOTATION, annotation));
  }

  static renderAnnotations(annotations, editing) {
    svg.select('g.annotations').remove();
    const makeThis = d3v4.annotation()
      .type(type)
      .annotations(annotations)
      .editMode(editing);

    svg.append('g')
      .attr('class', 'annotations')
      .call(makeThis);
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
      connector: { end },
      x: coords[0],
      y: coords[1],
      dx: 30,
      dy: -30,
    }];

    ChartAnnotations.renderAnnotations(annotations, true);
    ChartAnnotations.updateStoreAddAnnotation(annotations[0]);
  }

  constructor(props) {
    super(props);

    ChartAnnotations.updateStoreAddAnnotation =
      ChartAnnotations.updateStoreAddAnnotation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { editing, chartReady, annotations } = nextProps;
    svg = d3v4.select('.nv-chart svg');
    ChartAnnotations.renderAnnotations(annotations, editing);
    if (editing && chartReady) {
      const { width, height, x, y } = svg.node().getBBox();
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
        .on('click', ChartAnnotations.createAnnotation);
    }

    if (!editing && chartReady) {
      d3v4.select('.anno-container').remove();
    }
  }

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
