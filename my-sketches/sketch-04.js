const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const TweakPane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
  rows: 10,
  cols: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt'
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const rows = params.rows;
    const cols = params.cols;
    const numCells = rows * cols;

    const gridW = 0.8 * width;
    const gridH = 0.8 * height;
    const cellW = gridW / cols;
    const cellH = gridH / rows;
    const margX = ( width - gridW ) / 2;
    const margY = ( height - gridH ) / 2;

    for( let i = 0; i < numCells; i++ ){

      const col = i % cols;
      const row = Math.floor( i / cols );

      const x = col * cellW;
      const y = row * cellH;
      const h = 0.8 * cellH;
      const w = 0.8 * cellW;

      const f = params.animate ? frame : params.frame;

      // const n = random.noise2D(x + frame * 10, y, params.freq);
      const n = random.noise3D(x, y, f * 10, params.freq);
      const angle = n * Math.PI * params.amp;
      // const scale = ( n + 1 ) / 2 * 30;
      const scale = math.mapRange( n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();

      context.translate(x, y);
      context.translate(cellW * 0.5, cellW * 0.5);
      context.translate(margX, margY);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(w * 0.5, 0);
      context.lineTo(w * -0.5, 0);
      context.stroke();

      context.restore();
    }

  };
};

const createPane = () =>{
  const pane = new TweakPane.Pane();
  let folder = pane.addFolder({ title: 'Grid' });
  folder.addInput(params, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square' } });
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 2, max: 100 });
  folder.addInput(params, 'scaleMax', { min: 2, max: 100 });

  folder = pane.addFolder({ title: "noise" });
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01});
  folder.addInput(params, 'amp', { min: 0, max: 1});
  folder.addInput(params, 'frame', { min: 0, max: 999});  
  folder.addInput(params, 'animate');

}

createPane();

canvasSketch(sketch, settings);
