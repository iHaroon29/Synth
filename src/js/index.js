import animation from './animation.js'
import constants from './constants.js'

const { initialOctave } = constants
const { offAnimation, onAnimation, initializeCanvas } = animation

const toggle = document.querySelector('#toggle')
const whiteKeyHolders = document.querySelectorAll('.whiteBtnHolder')
const blackKeyHolders = document.querySelectorAll('.blackBtnHolder')
const gainKnobHolder = document.querySelector('#gainKnob')
const gainValue = document.querySelector('#gainValue')
const pannerSlider = document.querySelector('#panner')

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

const audioContext = new AudioContext()
const panner = audioContext.createStereoPanner()
const analyzer = audioContext.createAnalyser()
const mainGainNode = audioContext.createGain()

const oscList = []
let signal = ''

mainGainNode.connect(panner)
panner.connect(audioContext.destination)

toggle.addEventListener('change', (e) => {
  const { checked } = e.target
  if (checked) {
    signal = 'on-animation'
  } else {
    signal = ''
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
  if (!toggle.checked) return alert('Synth is off')
  signal !== '' ? (signal = '') : null
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
  gainValue.innerText = Math.floor(+e.target.value * 100)
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

const draw = () => {
  initializeCanvas()
  switch (signal) {
    case 'on-animation':
      onAnimation()
      break
    default:
      break
  }
  requestAnimationFrame(draw)
}

draw()
