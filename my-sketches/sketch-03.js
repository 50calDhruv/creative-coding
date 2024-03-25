const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const randomRange = ( min, max ) =>{
  return Math.random() * ( max - min ) + min;
}

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

// const animate = () =>{
//   console.log('bleh');
//   requestAnimationFrame(animate);
// }

// animate();


const sketch = ({ context, width, height }) => {

  const agents = [];

  for( let i = 0; i < 40; i++ ){
    const x = randomRange(0, width);
    const y = randomRange(0, height);

    agents.push( new Agent(x, y) );
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for( let i = 0; i < agents.length; i++ ){
      const agent = agents[i];

      for( let j = i + 1; j < agents.length; j++ ){
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if( dist > 175 ) continue;

        context.lineWidth = math.mapRange( dist, 0, 200, 6, 1 )

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    agents.forEach((elem, index)=>{
      elem.update();
      elem.draw(context);
      elem.bounce(width, height);
    })
    
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y; 
  }

  getDistance(v){
    return Math.sqrt( Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2) )
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(randomRange(-1, 1), randomRange(-1, 1));
    this.radius = randomRange(4, 12);
  }

  bounce(width, height) {
    if( this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if( this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 2;

    context.beginPath();
    context.arc( 0, 0, this.radius, 0, Math.PI * 2 );    
    context.fill();
    context.stroke();

    context.restore();
  }
}