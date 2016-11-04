
import React, { Component } from 'react';
import _ from 'underscore';

import LocalStorageMixin from 'react-localstorage';
import { DraggableCore } from 'react-draggable';

import './cells.css'

const { sqrt, abs } = Math;

import { random, rand } from './random';

const Cells = React.createClass({
  getInitialState() {
    return {
      colors: {
          red: { beg: "#ff6666", mid: "#ff0000", end: "#b30000" },
          orange: { beg: "#ffc266", mid: "#ff9900", end: "#b36b00" },
          yellow: { beg: "#ffff00", mid: "gold", end: "#cccc00" },
          green: { beg: "#80ff80", mid: "#00ff00", end: "#00b300" },
          blue: { beg: "#80e5ff", mid: "#0066ff", end: "#0000ff" }
      },
      cells: [
        { r: 100, x: 150, y: 150 },
        { r: 90, x: 350, y: 250 },
        { r: 80, x: 300, y: 100 }
      ]
    }
  },

  mixins: [ LocalStorageMixin ],

  getStateFilterKeys() {
    return [ 'cells' ];
  },

  shuffle() {
    this.setState({ drawChroms: true });
  },

  newCell(e) {
    const { offsetX, offsetY } = e.nativeEvent;
    let cells = this.state.cells.concat();
    cells.push({ r: 80, x: offsetX, y: offsetY });
    this.setState({ cells });
  },

  moveCell(idx, dx, dy) {
    let cells = this.state.cells.concat();
    cells[idx] = { r: cells[idx].r, x: cells[idx].x + dx, y: cells[idx].y + dy };
    this.setState({ cells });
  },

  render() {
    const { colors, cells } = this.state;
    const gradients = _.map(colors, (color, id) => <Gradient {...color} id={id} key={id} />);
    const cellObjs =
          cells.map(
                (cell, i) =>
                      <Cell
                            key={i}
                            idx={i}
                            moved={(dx, dy) => this.moveCell(i, dx, dy)}
                            {...cell}
                      />
          );
    return <div>
      <svg onDoubleClick={this.newCell}>
        <defs>{gradients}</defs>
        {cellObjs}
      </svg>
      <input type="button" onClick={this.shuffle} value="Redraw" />
    </div>;
  }
});

class Gradient extends Component {
  render() {
    const { id, beg, mid, end } = this.props;
    return <linearGradient id={id}>
      <stop offset="5%"  stopColor={beg}/>
      <stop offset="50%"  stopColor={mid}/>
      <stop offset="95%" stopColor={end}/>
    </linearGradient>;
  }
}

const Cell = React.createClass({

  getInitialState() {
    const chrs = [
      { size: 1, color: 'red' },
      { size: 0.9, color: 'orange' },
      { size: 0.8, color: 'yellow' },
      { size: 0.7, color: 'green' },
      { size: 0.6, color: 'blue' }
    ];

    const maxChrRatio = 1.2, chrHeightRatio = 0.1;

    let chrRects = [];
    chrs.forEach(({size, color}, idx) => {
      chrRects.push(this.getChrRect(size, color, 2*idx, maxChrRatio, chrHeightRatio));
      chrRects.push(this.getChrRect(size, color, 2*idx + 1, maxChrRatio, chrHeightRatio));
    });

    return {
      maxChrRatio,
      chrHeightRatio,
      chrs,
      chrRects
    };
  },

  getChrRect(size, color, idx, maxChrRatio, chrHeightRatio) {
    const { r } = this.props;
    const r2 = r*r;

    // chr rect dimensions
    const rawW = r * maxChrRatio * size;
    const rawH = r * chrHeightRatio;

    // give the rect a bit of padding between the outside of the cell
    const pad = 5;
    const w = rawW + pad;
    const h = rawH + pad;

    // eligible triangle vertex coords
    const tx = sqrt(r2 - h*h/4);
    const ty = sqrt(r2 - w*w/4);

    // triangle dimensions
    const tw = tx - w / 2;
    const th = ty - h / 2;

    let region = rand(4);

    const [xSign, ySign] = { 0: [1,1], 1: [1,-1], 2: [-1,1], 3: [-1,-1] }[region];

    const dy = th * sqrt(random()) * ySign;
    const dx = tw * (1 - abs(dy)/th) * random() * xSign;

    const x = -w / 2 + dx;
    const y = -h / 2 + dy;

    return <g key={idx} transform={"rotate(" + rand(360) + ")"}>
        <rect
              className={"chr chr-" + color}
              width={rawW}
              height={rawH}
              x={x + pad/2}
              y={y + pad/2}
              fill={"url(#" + color + " )"}
              stroke="none"
        />
    </g>
          ;
  },

  onDrag(e, ui) {
    this.props.moved(ui.deltaX, ui.deltaY);
  },

  render() {
    const { r, x, y } = this.props;
    const { chrRects } = this.state;

    return <DraggableCore onDrag={this.onDrag}>
      <g
            className="cell"
            transform={"translate(" + x + "," + y + ")"}
      >
        <circle r={r} cx={0} cy={0} stroke="black" fill="white" />
        <Dot />
        {chrRects}
      </g>
    </DraggableCore>
          ;
  }
});

// eslint-disable-next-line
class Dot extends Component {
  render() {
    const {x,y} = this.props;
    return <circle r="2" cx={x} cy={y} fill="black" />
  }
}

export default Cells;
