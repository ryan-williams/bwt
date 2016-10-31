
import React, { Component } from 'react';
import Arrows from './Arrows';

class SortTables extends Component {
  render() {
    const { w, h, fontSize, rowStrs, sortedStrs, sortMappingDict, cellsWidth, sortArrowsWidth } = this.props;
    return <g>
      <SvgCells name="suffixes" {...{w, h, fontSize, rowStrs}} />
      <g transform={"translate(" + cellsWidth + ",0)"}>
        <Arrows {...{sortMappingDict, width: sortArrowsWidth, h}} />
      </g>
      <g transform={"translate(" + (cellsWidth + sortArrowsWidth) + ",0)"}>
        <SvgCells name="sorted-suffixes" {...{w, h, fontSize, rowStrs: sortedStrs}} />
      </g>
    </g>;
  }
}

class SvgCells extends Component {
  render() {
    const { w, h, rowStrs, fontSize } = this.props;

    const n = rowStrs.length;

    let cells = [];
    rowStrs.forEach((rowStr, r) => {
      let masking = false;
      rowStr.split('').forEach((ch, c) => {
        cells.push(
              <text
                    key={r+","+c}
                    x={w*(c+.5)}
                    y={h*(r+.5)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    //fontFamily="monospace"
                    fontSize={fontSize}
                    className={masking ? "masked" : ""}
              >
                {ch}
              </text>
        );
        if (ch === '$') {
          masking = true;
        }
      });
    });
    return <g className={['letters'].concat([this.props.name] || []).join(' ')}>
      {cells}
      <rect stroke="black" fill="transparent" x="0" y="0" width={n * w} height={n * h} />
    </g>;
  }
}

export default SortTables;
