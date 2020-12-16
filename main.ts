// null.showColor(neopixel.colors(NeoPixelColors.Red))
function ALLOn (val: number) {
    strip.clear()
    for (let index22 = 0; index22 <= NumOfLEDs; index22++) {
        strip.showRainbow(1, 360)
    }
    strip.show()
}

function aaam () {
    MicVal = input.soundLevel()
    _aaamT = 4
    if (MicVal > 100) {
        AaamLedState[0] = _aaamT
    }
    strip.clear()
    for (let index1 = 0; index1 <= AaamLedStep - 1; index1++) {
        _b = 45
        if (AaamLedState[index1] > 0) {
            _b = 45
        } else {
            _b = 0
        }
        for (let index2 = (NumOfLEDs/AaamLedStep)*index1; index2 <= (NumOfLEDs/AaamLedStep)*(index1+1); index2++) {
            strip.setPixelColor(index2, neopixel.hsl(AaamLedColor[index1], 100, _b))
            strip.setPixelColor(39 - index2, neopixel.hsl(AaamLedColor[index1], 100, _b))
            strip.setPixelColor(index2 + 41, neopixel.hsl(AaamLedColor[index1], 100, _b))
            strip.setPixelColor(81 - index2, neopixel.hsl(AaamLedColor[index1], 100, _b))
            if(index1==AaamLedStep-1){
                strip.setPixelColor(19, neopixel.hsl(AaamLedColor[index1], 100, _b))
                strip.setPixelColor(20, neopixel.hsl(AaamLedColor[index1], 100, _b))
                strip.setPixelColor(60, neopixel.hsl(AaamLedColor[index1], 100, _b))
                strip.setPixelColor(61, neopixel.hsl(AaamLedColor[index1], 100, _b))
                strip.setPixelColor(62, neopixel.hsl(AaamLedColor[index1], 100, _b))

            }
        }
    }
    for (let index12 = 0; index12 <= AaamLedStep - 1; index12++) {
        if (AaamLedState[index12] > 0) {
            AaamLedState[index12] -= 1;
        }
        if (index12 < AaamLedStep - 1) {
            if (AaamLedState[index12] == 1 && AaamLedState[index12 + 1] == 0) {
                AaamLedState[index12 + 1] = _aaamT
                AaamLedColor[index12 + 1] = Math.random() * 360
            }
        }
    }
    strip.show()
}


// t = current time
// b = start value
// c = change in value
// d = duration
// basic.pause(1)
function breath () {
    if (t % 100 == 0) {
        breathDir *= -1;
    }
    // breathB = easeInOutQuad(t % 100, 45, 10, 100)
    if (breathDir == 1) {
        breathB = easeInOutQuad(t % 100, 0, 100, 100)
    } else {
        serial.writeLine("here")
        breathB = 100 - easeInOutQuad(t % 100, 0, 100, 100)
    }
    // serial.writeLine(breathB.toString())
    // serial.writeLine(breathB.toString() +", " + breathDir.toString())
    strip.clear()
    for (let index = 0; index <= 120; index++) {
        strip.setPixelColor(index, neopixel.hsl(t / 20 % 360, 100, breathB * 0.45 + 5))
        strip.setPixelColor(41 - index, neopixel.hsl(t / 20 % 360, 100, breathB * 0.45 + 5))
        strip.setPixelColor(index + 42, neopixel.hsl(t / 20 % 360, 100, breathB * 0.45 + 5))
    }
    strip.show()
}
input.onButtonPressed(Button.A, function () {
    mode += 0 - 1
    if (mode < 0) {
        mode = 3
    }
    mode = mode % 4
})
// null.showColor(neopixel.colors(NeoPixelColors.Red))
function Equalizer (val: number) {
    MicVal = input.soundLevel()
    anchor = MicVal / 100 * NumOfLEDs
    strip.clear()
    for (let index222 = 0; index222 <= NumOfLEDs; index222++) {
        // strip.setPixelColor(index22, neopixel.hsl(index22 * ColorStep, 100, 50))
        // strip.setPixelColor(index22, neopixel.hsl(index22 * ColorStep, 40, 5))
        if (index222 <= anchor) {
            strip.setPixelColor(index222, neopixel.hsl(index222 * ColorStep, 100, 50))
            strip.setPixelColor(39 - index222, neopixel.hsl(index222 * ColorStep, 100, 50))
            strip.setPixelColor(index222 + 41, neopixel.hsl(index222 * ColorStep, 100, 50))
            strip.setPixelColor(81 - index222, neopixel.hsl(index222 * ColorStep, 100, 50))
        } else {
            strip.setPixelColor(index222, neopixel.hsl(index222 * ColorStep, 40, 5))
            strip.setPixelColor(39 - index222, neopixel.hsl(index222 * ColorStep, 40, 5))
            strip.setPixelColor(index222 + 41, neopixel.hsl(index222 * ColorStep, 40, 5))
            strip.setPixelColor(81 - index222, neopixel.hsl(index222 * ColorStep, 40, 5))
        }
    }
    strip.show()
    basic.pause(1)
}
// t = current time
// b = start value
// c = change in value
// d = duration
function easeInOutQuad (_t: number, _b: number, _c: number, _d: number) {
    _t /= _d/2;
if (_t < 1) {
        return _c / 2 * _t * _t + _b
    }
    _t += -1
    return (0 - _c) / 2 * (_t * (_t - 2) - 1) + _b
}
input.onButtonPressed(Button.B, function () {
    mode += 1
    mode = mode % 4
})
let breathB = 0
let t = 0
let _aaamT = 0
let MicVal = 0
let ColorStep = 0
let mode = 0
let anchor = 0
let _b = 0
let AaamLedState: number[] = []
let AaamLedColor: number[] = []
let AaamLedStep = 0
let breathDir = 0
let NumOfLEDs = 0
let strip: neopixel.Strip = null
let _t = 0
AaamLedStep = 19
AaamLedState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
AaamLedColor = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
NumOfLEDs = 21
let TotalNumLeds = 81
anchor = 0
mode = 0
strip = neopixel.create(DigitalPin.P2, TotalNumLeds, NeoPixelMode.RGB)
ColorStep = 360 / NumOfLEDs
breathDir = 1
basic.forever(function () {
    // if (t >= 255) {
    // t = 0
    // }
    if (mode == 0) {
        ALLOn(1)
    }
    if (mode == 1) {
        Equalizer(1)
    }
    if (mode == 2) {
        breath()
    }
    if (mode == 3) {
        aaam()
    }
    t += 1
})
