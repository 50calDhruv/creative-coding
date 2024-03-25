const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const degToRad = ( degrees ) =>{
  return degrees/180 * Math.PI;
}

const randomRange = ( min, max ) =>{
  return Math.random() * ( max - min ) + min;
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";
    
    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;
    const num = 24;
    const radius = width*0.3;

    for( let i = 0; i < num; i++ ){

      const slice = degToRad(360/num);
      const angle = slice*i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);
      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale( randomRange( 0.5, 2 ), randomRange( 0.2, 1 ) );

      context.beginPath();
      context.rect( -w/2 , randomRange(0, -h/2) , w, h );
      context.fill();
      context.restore();

      context.save();

      context.translate( cx, cy );
      context.rotate( -angle );

      context.lineWidth = randomRange( 5, 20 );
      context.beginPath();
      context.arc(0, 0, radius * randomRange( 0.7, 1.3 ), slice * randomRange(1, -6), slice * randomRange(1, 3));
      context.stroke();

      context.restore();
    }
    
    // context.translate( 100, 400 );
    // context.beginPath();
    // context.arc(0, 0, 50, 0, Math.PI * 2);
    // context.fill();
  };
};

canvasSketch(sketch, settings);
