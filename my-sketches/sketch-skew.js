const canvasSketch = require('canvas-sketch');
const { degToRad } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({ context, width, height }) => {

  let x, y, w, h, fill, stroke, hue, blend;

  const mask = {
    sides: 6,
    radius: 400,
    x: width / 2,
    y: height / 2
  }

  const num = 30;
  const degrees = 30;

  const rects = [];

  for( let i = 0; i < num; i++ ){
      
    hue = 360 * Math.random();
    x = random.range(0,width);
    y = random.range(0,height);
    w = random.range(200, 600);
    h = random.range(40, 200);  
    blend = Math.random > 0.5 ? 'overlay' : 'source-over';

    fill = `hsl(${hue}, ${random.range(73,83)}%, ${random.range(56,76)}%)`;
    stroke = `hsl(${hue}, ${random.range(36,46)}%, ${36,77}%)`;

    rects.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = `hsl(${360*Math.random()}, ${random.range(36,46)}%, ${random.range(36,77)}%)`;
    context.fillRect(0, 0, width, height);    

    context.save();

    context.translate( width * 0.5, height * 0.5 );
    
    drawPolygon({ context, radius: mask.radius, sides: mask.sides });    
    context.clip();    

    rects.forEach((rect)=>{
      const { x, y, w, h, fill, stroke, blend } = rect;

      context.save();    
      
      context.translate( width * -0.5, height * -0.5 );
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.translate(x, y);

      context.globalCompositeOperation = blend;

      drawSkewedRect( { context, w, h, degrees } );        

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.65;

      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      
      context.fill();

      context.shadowColor = null;
      context.stroke();

      context.globalCompositeOperation = 'source-over';

      // context.lineWidth = 1;
      // context.strokeStyle = 'black';
      context.stroke();
      context.restore();
    });
    
    context.restore();

    context.save();    
    context.translate(mask.x, mask.y);
    context.lineWidth = 10;
    drawPolygon({ context, radius: mask.radius - context.lineWidth, sides: mask.sides }); 
    context.globalCompositeOperation = 'color-burn';
    context.strokeStyle = fill;    
    context.stroke();

    context.restore();
  };
};

const drawPolygon = ({ context, radius = 100, sides = 3 }) =>{
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for(let i = 1; i < sides; i++){
    const theta = i * slice - Math.PI/2;
    context.lineTo( Math.cos(theta) * radius, Math.sin(theta) * radius );
  }
  context.closePath();
}

const drawSkewedRect = ( { context, w = 600, h = 200, degrees = -45 } ) =>{
  
  const angle = degToRad(degrees);
  const rx = w * Math.cos(angle);
  const ry = w * Math.sin(angle);

  context.save();

  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.stroke();  
  
  context.restore();
}

canvasSketch(sketch, settings);
