import constants from './constants.js'

const { frequency, amplitude, speed } = constants
const canvas = document.getElementById('oscilloscope')
const canvasCtx = canvas.getContext('2d')

let phase = 0

const initializeCanvas = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight / 2
  canvasCtx.fillStyle = 'black'
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
}

const onAnimationText = () => {
  canvasCtx.font = '30px serif'
  canvasCtx.fillStyle = 'red'
  canvasCtx.fillRect(
    (canvas.width - 200) / 2,
    (canvas.height - 100) / 2,
    150,
    70
  )
  canvasCtx.fillStyle = 'white'
  canvasCtx.fillText(
    'Hello Synth',
    (canvas.width - 190) / 2,
    (canvas.height - 10) / 2
  )
}

const onAnimationWave = () => {
  canvasCtx.fillStyle = 'rgba(255,0,0,0.5)'
  for (let i = 0; i < canvas.width; i += 10) {
    var y = canvas.height / 1.5 + Math.sin(i * frequency + phase) * amplitude
    canvasCtx.fillRect(i, y, 3, canvas.height - y)
  }
  phase += speed
}

const onAnimation = () => {
  onAnimationText()
  onAnimationWave()
}

export default { initializeCanvas, onAnimation }
