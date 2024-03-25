const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

let manager;
let minDb, maxDb;
let audio, audioContext, audioData, sourceNode, analyserNode;

const sketch = () => {

  const numCircles = 5;
  const numSlices = 1;
  const slice = Math.PI*2 / numSlices;
  const radius = 200;

  const bins = [];
  const lineWidths = [];
  const rotationOffsets = [];

  let lineWidth, bin, mapped, phi;

  for( let i =0; i < numCircles * numSlices; i++ ){        
    bin = random.rangeFloor(4, 64);
    bins.push(bin);
  }

  for( let i = 0; i < numCircles; i++ ){
    const t = i / ( numCircles - 1);
    lineWidth = eases.quadIn(t) * 200 + 10;
    lineWidths.push(lineWidth);
  }

  for( let i = 0; i < numCircles; i++ ){
    rotationOffsets.push(random.range(Math.PI * -0.25, Math.PI * 0.25) - Math.PI/2);
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#EEEAE0';
    context.fillRect(0, 0, width, height);

    if(!audioContext)
      return;
    
    analyserNode.getFloatFrequencyData(audioData);
    context.save();
    context.translate( width/2, height/2 );

    let cRadius = radius;

    for( let i = 0; i < numCircles; i++ ){
      context.save();
      context.rotate(rotationOffsets[i]);
      cRadius += lineWidths[i]/2 + 2;
      for( let j = 0; j < numSlices; j++ ){  

        context.rotate(slice);        
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];        

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);        

        phi = slice * mapped;

        context.beginPath();
        context.arc(0, 0, cRadius, 0, phi);
        context.stroke();      
      }

      cRadius += lineWidths[i]/2;
      context.restore();
    }

    context.restore();
    
  };
};

const addEventListeners = () =>{
  window.addEventListener('mouseup', ()=>{

    if(!audioContext)
      createAudio();
    if( audio.paused ){   
      audio.play();  
      manager.play();  
    }
    else{
      audio.pause();    
      manager.pause();    
    }
})
}

const createAudio = () =>{

  audio = document.createElement('audio');
  audio.src = 'audio/CheapThrills.mp3';  
  
  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.95;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount)
  
}

const getAverage = (data) =>{

  let sum = 0;
  data.forEach((elem)=>sum += elem);

  return sum / data.length;

}

const start = async () =>{

  addEventListeners();  
  manager = await canvasSketch(sketch, settings);
  manager.pause();
}

start();
