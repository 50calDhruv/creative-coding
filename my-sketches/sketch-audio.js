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
  const numSlices = 9;
  const slice = Math.PI*2 / numSlices;
  const radius = 200;

  const bins = [];
  const lineWidths = [];

  let lineWidth, bin, mapped;

  for( let i =0; i < numCircles * numSlices; i++ ){
    if(random.value() > 0.5 )
    bin = 0;
    else
      bin = random.rangeFloor(4, 64);
    bins.push(bin);
  }

  for( let i = 0; i < numCircles; i++ ){
    const t = i / ( numCircles - 1);
    lineWidth = eases.quadIn(t) * 200 + 20;
    lineWidths.push(lineWidth);
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
      for( let j = 0; j < numSlices; j++ ){  

        context.rotate(slice);        
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];
        if( !bin )
          continue;

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        lineWidth = lineWidths[i] * mapped;

        context.lineWidth = lineWidth;

        if( lineWidth < 1 )
          continue;

        context.beginPath();
        context.arc(0, 0, cRadius + context.lineWidth/2, 0, slice);        
        context.stroke();      
      }
      cRadius += lineWidths[i];
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
  audio.src = 'audio/intro.mp3';  
  
  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
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
