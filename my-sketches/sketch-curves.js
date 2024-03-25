const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ width, height }) => {

  const rows = 4;
  const cols = 72;
  const numCells = rows * cols;

  const gw = width * 0.8;
  const gh = height * 0.8;

  const cw = gw / cols;
  const ch = gh / rows;

  const mx = ( width - gw ) * 0.5;
  const my = ( height - gh ) * 0.5;

  const points = [];

  let x, y, lineWidth, n, color;  
  let frequency = 0.002;
  let amplitude = 90;
  
  const colors = colormap({
    colormap: 'magma',
    nshades: amplitude
  })

  for( let i = 0; i < numCells; i++ ){

    x = ( i % cols ) * cw;
    y = Math.floor( i / cols ) * ch;

    n = random.noise2D(x, y, frequency, amplitude);
    // x += n;
    // y += n;
    lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);

    color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];

    points.push(new Point({ x, y, lineWidth, color }))
  }

  return ({ context, width, height, frame }) => {
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate( mx, my );
    context.translate( cw/2, ch/2 );
    context.strokeStyle = 'red';

    points.forEach((point)=>{
      n = random.noise2D(point.ix + frame, point.iy, frequency, amplitude);
      point.x = point.ix + n;
      point.y = point.iy + n;
    })

    let lastX, lastY;

    for( let r = 0; r < rows; r++ ){      
      for( let c = 0; c < cols - 1; c++){
        
        const curr = points[ r*cols + c ];
        const next = points[ r*cols + c + 1 ];
        const mx = curr.x + (next.x - curr.x) * 0.8;
        const my = curr.y + (next.y - curr.y) * 5.5;

        if( !c ){
          lastX = curr.x;
          lastY = curr.y;  
        }        

        context.beginPath();
        context.lineWidth = curr.lineWidth;
        context.strokeStyle = curr.color;

        context.moveTo(lastX, lastY);
                
        context.quadraticCurveTo(curr.x, curr.y, mx, my);                
        context.stroke();

        lastX = mx - c / cols * 250;
        lastY = my - r / rows * 250;
      }      
    }

    // points.forEach((point)=>{
    //   point.draw(context);
    // });

    context.restore();
  };
};

class Point {
  constructor({ x, y, lineWidth, color }){
    this.x = x;
    this.y = y;    
    this.lineWidth = lineWidth;
    this.color = color;
    this.ix = x;
    this.iy = y;
  }

  draw(context){
    context.save();
    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fillStyle = "red";
    context.fill();
    context.restore();    
  }  
}

canvasSketch(sketch, settings);
