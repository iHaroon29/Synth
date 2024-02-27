const toggle = document.querySelector('#toggle')
const whiteKeyHolders = document.querySelectorAll('.whiteBtnHolder')
const blackKeyHolders = document.querySelectorAll('.blackBtnHolder')
const gainKnobHolder = document.querySelector('#gainKnob')
const pannerSlider = document.querySelector('#panner')
const canvas = document.getElementById('oscilloscope')

const whiteKeys = [
  'q',
  'w',
  'e',
  'r',
  't',
  'y',
  'u',
  'i',
  'o',
  'p',
  '[',
  ']',
  '\\',
  'l',
]
const blackKeys = ['2', '3', '5', '6', '7', '9', '0', '=', '/', '*']
const whiteTones = 'CDEFGABCDEFGAB'
const blackTones = 'C#,D#,F#,G#,A#,C#,D#,F#,G#,A#'
const combined = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B'

const initialFrequence = 261.6256
const initialOctave = 4

const canvasCtx = canvas.getContext('2d')

const audioContext = new AudioContext()
const panner = audioContext.createStereoPanner()
const analyzer = audioContext.createAnalyser()

const oscList = []

const frequency = 0.005
const amplitude = 50
const speed = 0.05

let start = false
let phase = 0
let mainGainNode = audioContext.createGain()
let initAnimationToggle = true
let raf
let j = 0

mainGainNode.connect(panner)
panner.connect(audioContext.destination)

const initializeCanvas = () => {
  canvasCtx.fillStyle = 'black'
  canvasCtx.clearRect(0, 0, 1000, 5000)
  canvasCtx.fillRect(0, 0, 1000, 5000)
}

initializeCanvas()

toggle.addEventListener('change', (e) => {
  start = !start
  if (start) {
    raf = requestAnimationFrame(draw)
    initAnimationToggle = true
  } else {
    cancelAnimationFrame(raf)
    initializeCanvas()
    initAnimationToggle = false
    j = 0
  }
})

whiteKeyHolders.forEach((btn, index) => {
  btn.setAttribute('data-key', whiteKeys[index])
  btn.setAttribute('data-tone', whiteTones[index])
  if (index < whiteKeyHolders.length / 2) {
    btn.setAttribute('data-octave', initialOctave)
  } else {
    btn.setAttribute('data-octave', initialOctave + 1)
  }
})

blackKeyHolders.forEach((btn, index) => {
  btn.setAttribute('data-key', blackKeys[index])
  btn.setAttribute('data-tone', blackTones.split(',')[index])
  if (index < blackKeyHolders.length / 2) {
    btn.setAttribute('data-octave', initialOctave)
  } else {
    btn.setAttribute('data-octave', initialOctave + 1)
  }
})

document.addEventListener('keydown', (e) => {
  if (!start) return alert('Synth is off')
  if (initAnimationToggle) initAnimationToggle = false
  e.preventDefault()
  const indexWhite = [...whiteKeyHolders].findIndex(
    (node) => node.getAttribute('data-key') === e.key
  )
  if (indexWhite !== -1) {
    updateUI(whiteKeyHolders[indexWhite], 'add')
    return generateFrequence(whiteKeyHolders[indexWhite])
  }

  const indexBlack = [...blackKeyHolders].findIndex(
    (node) => node.getAttribute('data-key') === e.key
  )

  if (indexBlack !== -1) {
    updateUI(blackKeyHolders[indexBlack], 'add')
    return generateFrequence(blackKeyHolders[indexBlack])
  }
  return
})

document.addEventListener('keyup', (e) => {
  whiteKeyHolders.forEach((key) => {
    if (key.getAttribute('data-active') == 'true') {
      updateUI(key, 'remove')
    }
  })

  blackKeyHolders.forEach((key) => {
    if (key.getAttribute('data-active') == 'true') {
      updateUI(key, 'remove')
    }
  })

  const index = oscList.findIndex((node) => node.key === e.key)
  if (index == -1) return
  oscList[index].osc.stop()
  oscList.splice(index, 1)
})

gainKnobHolder.addEventListener('input', (e) => {
  mainGainNode.gain.value = +e.target.value
})

pannerSlider.addEventListener('input', (e) => {
  panner.pan.value = e.target.value
})

const generateFrequence = (element) => {
  const octave = element.getAttribute('data-octave')
  const tone = element.getAttribute('data-tone')
  const key = element.getAttribute('data-key')
  const osc = oscList.find((node) => node.key === key)
  if (osc) return
  const index = combined.split(',').findIndex((node) => node === tone)
  if (octave === initialOctave) {
    playTone(freqCalc(index + getOctaveInitValue(initialOctave)), key)
  } else {
    playTone(freqCalc(index + getOctaveInitValue(initialOctave) + 12), key)
  }
}

const playTone = (freq, key) => {
  const osc = audioContext.createOscillator()
  osc.connect(mainGainNode)
  osc.frequency.value = freq
  oscList.push({ osc, key })
  osc.start()
}

const freqCalc = (n) => {
  return Math.pow(2, (n - 49) / 12) * 440
}

const updateUI = (element, action) => {
  if (action === 'add') {
    element.setAttribute('data-active', true)
    element.classList.add('scale-y-[0.99]')
  } else {
    element.setAttribute('data-active', false)
    element.classList.remove('scale-y-[0.99]')
  }
}

const getOctaveInitValue = (octave) => {
  switch (octave) {
    case 1:
      return 4
    case 2:
      return 16
    case 3:
      return 28
    case 4:
      return 40
    case 5:
      return 52
    case 6:
      return 64
    default:
      return 4
  }
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
    var y = 250 / 2 + Math.sin(i * frequency + phase) * amplitude
    canvasCtx.fillRect(i, y, 3, 200 - y)
  }
}

const onAnimation = () => {
  onAnimationText()
  onAnimationWave()
}

const draw = () => {
  initializeCanvas()
  if (initAnimationToggle) {
    onAnimation()
    phase += speed
  } else {
  }
  raf = requestAnimationFrame(draw)
}
