import constants from './constants.js'

const canvas = document.getElementById('oscilloscope')
const canvasCtx = canvas.getContext('2d')
const { textDelta, frequency, amplitude, speed } = constants

let phase = 0
let textAlpha = 1

const initializeCanvas = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight / 2
  canvasCtx.fillStyle = 'black'
  canvasCtx.clearRect(0, 0, 1000, 5000)
  canvasCtx.fillRect(0, 0, 1000, 5000)
}

const onAnimationText = () => {
  canvasCtx.font = '30px serif'
  canvasCtx.fillStyle = 'red'
  canvasCtx.fillRect(400, 20, 150, 70)
  canvasCtx.fillStyle = 'white'
  canvasCtx.fillText('Hello Synth', 800 / 2, 120 / 2)
}

const onAnimationWave = () => {
  canvasCtx.fillStyle = 'rgba(255,0,0,0.4)'
  for (let i = 0; i < 1000; i += 10) {
    var y = canvas.height / 1.5 + Math.sin(i * frequency + phase) * amplitude
    canvasCtx.fillRect(i, y, 3, canvas.height - y)
  }
  phase += speed
}

const onAnimation = () => {
  onAnimationText()
  onAnimationWave()
}

const offAnimationText = () => {
  textAlpha -= textDelta
  canvasCtx.font = '30px serif'
  canvasCtx.fillStyle = `rgba(255,0,0,${textAlpha})`
  canvasCtx.fillText('Hello Synth', 800 / 2, 120 / 2)
}

const offAnimation = () => {
  offAnimationText()
}

export default { initializeCanvas, onAnimation, offAnimation }
