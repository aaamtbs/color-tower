// 在這裡添加你的程式
/**
* Use this file to define custom functions and blocks.
* Read more at https://makecode.microbit.org/blocks/custom
*/

enum LEDMode {
        //% block="Rainbow Mode"
        Rainbow = 0,
        //% block="Equalizer Mode"
        Equalizer = 1,
        //% block="Breath Mode"
        Breath = 2,
        //% block="Rise Mode"
        Rise = 3,
        //% block="Free Mode"
        Free = 4
}

enum Level {
        //% block="Level 1"
        Level_1 = 0,
        //% block="Level 2"
        Level_2 = 1,
        //% block="Level 3"
        Level_3 = 2,
        //% block="Level 4"
        Level_4 = 3,
        //% block="Level 5"
        Level_5 = 4,
        //% block="Level 6"
        Level_6 = 5,
        //% block="Level 7"
        Level_7 = 6,
        //% block="Level 6"
        Level_8 = 7,
        //% block="Level 9"
        Level_9 = 8,
        //% block="Level 10"
        Level_10 = 9,
        //% block="Level 11"
        Level_11 = 10,
        //% block="Level 12"
        Level_12 = 11,
        //% block="Level 13"
        Level_13 = 12,
        //% block="Level 14"
        Level_14 = 13,
        //% block="Level 15"
        Level_15 = 14,
        //% block="Level 16"
        Level_16 = 15,
        //% block="Level 17"
        Level_17 = 16,
        //% block="Level 18"
        Level_18 = 17,
        //% block="Level 19"
        Level_19 = 18
}

/**
* Christmas Tree blocks
*/
//% weight=100 color=#c49118 icon="❄"
namespace ChristmasTree {
    /**
     * A ChristmasTree tree
     */
    export class ChristmasTree {
        mode:LEDMode;
        strip: neopixel.Strip;
        numOfLEDs:number;
        totalNumLeds:number;
        numOfLEDPerPillar:number;
        
        private _colorStep:number;

        private _lastMicVal:number;
        private _colorOffset:number;

        rainbowSpeed:number;
        private _isSetupRainbow:boolean;
        
        
        private _breathT:number;
        private _breathDir:number;
        private _breathColorOffset:number;

        private _riseDuration:number;
        private _riseState:number[];
        private _riseColor:number[];
        

        public updateVars():void{
            this._colorStep = 360/this.numOfLEDPerPillar;
            this._colorOffset = 0;
            this._lastMicVal = -1;
            this._breathT = 0;
            this._breathDir = 1;
            this._breathColorOffset = 0;

            this._riseState = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            this._riseColor = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            this._riseDuration = 3;

        }



        /**
         * Clear strip led color
         */
        //% blockId="christmastree_clearStrip" block="%tree clear led color"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public clearStrip():void{
            this.strip.clear();
        }

        /**
         * Show strip led color
         */
        //% blockId="christmastree_showStrip" block="%tree show led color"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public showStrip():void{
            this.strip.show();
        }

        /**
         * Shows a rainbow pattern on all LEDs.
         * @param startHue the start hue value for the rainbow, eg: 1
         * @param endHue the end hue value for the rainbow, eg: 360
         */
        //% blockId="christmastree_changeMode" block="%tree|change mode to %mode"
        //% tree.defl=tree
        //% weight=85 blockGap=8
        //% parts="christmastree"
        public changeMode(m:LEDMode):void{
            this._isSetupRainbow = false;
            this.mode = m;
        }

        /**
         * Shows a rainbow pattern on all LEDs.
         * @param startHue the start hue value for the rainbow, eg: 1
         * @param endHue the end hue value for the rainbow, eg: 360
         */
        //% blockId="christmastree_rotatePixelColor" block="%tree|move pixel by %mode|pixel"
        //% tree.defl=tree
        //% weight=85 blockGap=8
        //% parts="christmastree"
        public rotatePixelColor(speed:number):void{
            this.rainbowSpeed = speed;
            if(this.rainbowSpeed > 5 ){
                this.rainbowSpeed = 5;
            }
            if(this.rainbowSpeed < -5 ){
                this.rainbowSpeed = -5;
            }
            this.strip.rotate(this.rainbowSpeed);
        }

        /**
         * Play next animation
         */
        //% blockId="christmastree_nextMode" block="%tree play next mode"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public nextMode():void{
            this._isSetupRainbow = false;
            this.mode += 1;
            if(this.mode>=4){
                this.mode = 0;
            }
        }

        /**
         * Play previous animation
         */
        //% blockId="christmastree_previousMode" block="%tree play previous mode"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public previousMode():void{
            this._isSetupRainbow = false;
            this.mode -= 1;
            if(this.mode<=0){
                this.mode = 3;
            }
        }

        /**
         * Update animation
         */
        //% blockId="christmastree_update" block="%tree update lighting animation"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public update():void{
            if(this.mode==0){
                this.rainbowAnimation(this.rainbowSpeed);
                this.showStrip();
                basic.pause(100);
            }else if(this.mode==1){
                let mic = 128
                try{
                    mic = input.soundLevel()
                }catch(err){
                    mic = 128
                }
                this.equalizerAnimation(mic);
                this.showStrip();
                basic.pause(1);
            }else if(this.mode==2){
                this.breathAnimation();
                this.showStrip();
            }else if(this.mode==3){
                let mic = 128
                try{
                    mic = input.soundLevel()
                }catch(err){
                    mic = 128
                }
                this.riseAnimation(mic, 100)
                this.showStrip();
            }else{
                this.showStrip();
            }
            this._colorOffset+=1;
            this._breathColorOffset+=1;
            this._breathT+=1;

            if(this._colorOffset>360){
                this._colorOffset = 0;
            }
            if(this._breathT>100){
                this._breathT = 1;
            }
        }

        /**
         * Set leds strip to rainbow pattern.
         */
        //% blockId="christmastree_showRainbow" block="%tree|set to rainbow pattern"
        //% tree.defl=tree
        //% weight=85 blockGap=8
        //% parts="christmastree"
        public showRainbow():void{
            this.strip.showRainbow();
        }

        /**
         * Play rainbow animation
         */
        //% blockId="christmastree_rainbowAnimation" block="%tree play rainbow animation width speed%speed"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public rainbowAnimation(speed:number):void{
            this.rainbowSpeed = speed;
            if(this._isSetupRainbow == false || this._isSetupRainbow == null){
                this._isSetupRainbow = true;
                this.strip.clear()
                this.strip.showRainbow(1, 360)
            }
            this.rotatePixelColor(this.rainbowSpeed)
        }


        /**
         * Play equalizer animation
         */
        //% blockId="christmastree_equalizerAnimation" block="%tree play equalizer animation with sound level%value"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public equalizerAnimation(micVal:number):void{
            if(this._lastMicVal!=-1){
                if(micVal < this._lastMicVal){
                    micVal = micVal + ((this._lastMicVal - micVal) * 0.2)
                }else{
                    micVal = this._lastMicVal + ((micVal - this._lastMicVal) * 0.95)
                }
            }
            this._lastMicVal = micVal;
            let anchor:number = micVal / 100 * this.numOfLEDPerPillar
            
            this.strip.clear()
            for (let idx = 0; idx <= this.numOfLEDPerPillar; idx++) {
                let _color = idx * this._colorStep + this._colorOffset % 360
                if (idx <= anchor) {
                    this.setLevelColor(idx, this.makeColor(_color, 100, 50))
                } else {
                    let _saturation:number = (45 - 5) * ((this.numOfLEDPerPillar - idx) / (this.numOfLEDPerPillar - anchor)) * 0.6
                    let _brightness:number = (100 - 40) * ((this.numOfLEDPerPillar - idx) / (this.numOfLEDPerPillar - anchor)) * 1
                    if (_saturation < 5) {
                        _saturation = 5
                    }
                    this.setLevelColor(idx, this.makeColor(_color, _saturation, _brightness))
                }
            }
        }

        /**
         * Play breath animation
         */
        //% blockId="christmastree_breathAnimation" block="%tree play breath animation"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public breathAnimation () {
            if (this._breathT % 100 == 0) {
                this._breathDir *= -1;
            }
            let breathB = 0;
            if (this._breathDir == 1) {
                breathB = this.easeInOutQuad(this._breathT % 100, 0, 100, 100)
            } else {
                breathB = 100 - this.easeInOutQuad(this._breathT % 100, 0, 100, 100)
            }

            this.strip.clear()
            for (let index = 0; index < this.numOfLEDPerPillar; index++) {
                let color = this.makeColor((this._breathColorOffset / 7 + (60 / this.numOfLEDPerPillar * index)) % 360, 100, breathB * 0.45 + 5)
                this.setLevelColor(index, color)
            }
            
        }

        /**
         * Play rise animation
         */
        //% blockId="christmastree_riseAnimation" block="%tree play rise animation with sound level%micVale and trigger threshold%threshold"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public riseAnimation(micVal:Number, threshold:Number):void{
            let _duration = 3
            if (micVal > threshold) {
                this.triggerRise(_duration)
            }
            this.moveRise()
        }

        

        /**
         * Trigger rise led effect
         */
        //% blockId="christmastree_triggerRiseWithColor" block="%tree trigger rise led effect with %duration|duration and %color|color"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public triggerRiseWithColor(duration:number, color:number):void{
            this._riseDuration = duration
            let _duration = this._riseDuration
            this._riseState[0] = this._riseState[1] = _duration
            this._riseColor[0] = this._riseColor[1] = this.makeColor(color, 100, 50)
        }
        

        /**
         * Trigger rise led effect
         */
        //% blockId="christmastree_triggerRise" block="%tree trigger rise led effect with %duration|duration"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public triggerRise(duration:number):void{
            this._riseDuration = duration
            let _duration = this._riseDuration
            this._riseState[0] = this._riseState[1] = _duration
            this._riseColor[0] = this._riseColor[1] = this.makeColor(Math.random() * 360, 100, 50)
        }
        
        /**
         * Move rise led move upward
         */
        //% blockId="christmastree_moveRise" block="%tree move rise led upward"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public moveRise():void{
            let _duration = this._riseDuration
            this.strip.clear()

            for (let level = 0; level < this.numOfLEDPerPillar; level++) {
                if(this._riseState[level] > 0){
                    this.setLevelColor(level, this._riseColor[level])
                    this._riseState[level] -= 1;
                    if(this._riseState[level]==0 && level + 1 < this.numOfLEDPerPillar){
                        this._riseState[level+1] = _duration + 1;
                        this._riseColor[level+1] = this._riseColor[level]
                    }
                }else{
                    this.setLevelColor(level, this.makeColor(30, 25, 10))
                }
            }
        }

        private makeColor(color:number, saturation:number, brightness:number):number{
            return neopixel.hsl(color, saturation, brightness)
        }

        /**
         * Set christmas tree color
         */
        //% blockId="christmastree_setTreeColor" block="%tree set christmas tree led color to %color=neopixel_colors"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public setTreeColor(color:number):void{
            for (let idx = 0; idx <= 19; idx++) {
                this.setLevelColor(idx, color)
            }
        }

        /**
         * Set christmas tree brightness
         * value larger than 50 color will change to white
         */
        //% blockId="christmastree_setTreeColorAndBrightness" block="%tree set christmas tree color to %color=christmastree_pickColorHue and led brightness to %brightness"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public setTreeColorAndBrightness(color:number, brightness:number):void{
            for (let idx = 0; idx <= 19; idx++) {
                this.setLevelColor(idx, neopixel.hsl(color, 100, brightness))
            }
        }

        

        /**
         * Set christmas tree brightness
         * Set specfic level to different color and brightness
         * (0 = level-1, 1 = level-2, etc...)
         */
        //% blockId="christmastree_setLevelColorAndBrightness" block="%tree set level-%level=christmastree_levels color to %color=christmastree_pickColorHue and led brightness to %brightness"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public setLevelColorAndBrightness(level:number, color:number, brightness:number):void{
            this.setLevelColor(level, neopixel.hsl(color, 100, brightness))
        }

        /**
         * Set specfic level to different color 
         * (0 = level-1, 1 = level-2, etc...)
         */
        //% blockId="christmastree_setLevelColor" block="%tree set level-%level=christmastree_levels led to %color=neopixel_colors"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public setLevelColor(level:number, color:number):void{
            this.strip.setPixelColor(level, color)
            this.strip.setPixelColor(39 - level, color)
            this.strip.setPixelColor(level + 41, color)
            this.strip.setPixelColor(81 - level, color)

            if(level==this.numOfLEDPerPillar-1){
                this.strip.setPixelColor(19, color)
                this.strip.setPixelColor(20, color)
                this.strip.setPixelColor(60, color)
                this.strip.setPixelColor(61, color)
                this.strip.setPixelColor(62, color)
            }
        }

        /**
         * Set pixel color 
         * (0 = index-1, 1 = index-2, etc...)
         */
        //% blockId="christmastree_setPixelColor" block="%tree set pixel-%index led to %color=neopixel_colors"
        //% tree.defl=tree
        //% weight=90 blockGap=8
        //% parts="christmastree"
        public setPixelColor(index:number, color:number):void{
            this.strip.setPixelColor(index, color)
        }

        public easeInOutQuad (_percent: number, _elapsed: number, _start: number, _end: number) {
            _percent /= _end/2;
            
            if (_percent < 1) {
                return _start / 2 * _percent * _percent + _elapsed
            }
            _percent += -1
            return (0 - _start) / 2 * (_percent * (_percent - 2) - 1) + _elapsed
        }
    }   
   /**
     * Create a new Christmas Tree controller.
     * @param mode the default mode where the Christmas tree default setting.
     */
    //% blockId="christmastree_create" block="Create christmas tree"
    //% weight=90 blockGap=8
    //% parts="christmastree"
    //% trackArgs=0,1
    //% blockSetVariable=tree
    export function create(): ChristmasTree {
        let tree = new ChristmasTree();
        tree.mode = LEDMode.Rainbow;
        tree.numOfLEDPerPillar = 19;
        tree.totalNumLeds = 81;
        tree.strip = neopixel.create(DigitalPin.P2, tree.totalNumLeds, NeoPixelMode.RGB);
        tree.rainbowSpeed = 1;

        tree.updateVars();
        return tree;
    }

    /**
     * Gets the level value of a known levels
    */
    //% weight=2 blockGap=8
    //% blockId="christmastree_levels" block="%level"
    //% advanced=true
    export function levels(_level: Level): number {
        return _level;
    }

    /**
     * Gets color
    */
    //% weight=2 blockGap=8
    //% blockId="christmastree_pickColors" block="Color $color"
    //% color.shadow="colorWheelHsvPicker"
    export function color(color: number): number {
        return neopixel.hsl( color/255*360 , 100, 50);
    }

    /**
     * Gets color hue
    */
    //% weight=2 blockGap=8
    //% blockId="christmastree_pickColorHue" block="Hue $color"
    //% color.shadow="colorWheelHsvPicker"
    export function hue(color: number): number {
        return (color%255)/255 * 360;
    }
	
	
	/**
	 * Gets color wheel
	*/
	//% weight=2 blockGap=8
	//% blockId="christmastree_pickColorWheel" block="WheelColor $color"
	//% color.shadow="colorWheelPicker"
	function getWheelColor(color: number): number {
		let colorWheel = [
			{r:0,   g:255, b:255},
			{r:60,  g:195, b:255},
			{r:120, g:135, b:255},
			{r:180, g:75,  b:255},
			{r:240, g:15,  b:255},
			{r:255, g:45,  b:210},
			{r:255, g:105, b:150},
			{r:255, g:165, b:90},
			{r:255, g:225, b:30},
			{r:225, g:255, b:30},
			{r:165, g:255, b:90},
			{r:105, g:255, b:150},
			{r:45,  g:255, b:210}
		];

		let lerp = function  (start: number, end: number, amt: number): number{
		  return (1-amt)*start+amt*end
		}
		color = color >> 0;
		color = (color>255)?255:color;
		let _percent = color / 256;
		let b_index = Math.floor(_percent*colorWheel.length);
		let e_index = b_index + 1;
		e_index = (e_index>colorWheel.length-1)?colorWheel.length-1:e_index
		
		let start = {r:colorWheel[b_index].r, g:colorWheel[b_index].g, b:colorWheel[b_index].b}
		let end = {r:colorWheel[e_index].r, g:colorWheel[e_index].g, b:colorWheel[e_index].b}
		let u = _percent * colorWheel.length - 1.
		u =  u - Math.floor(u);

		let r = Math.round(lerp(start.r, end.r, u));
		let g = Math.round(lerp(start.g, end.g, u));
		let b = Math.round(lerp(start.b, end.b, u));
		//let colorname = 'rgb(' + r + ',' + g + ',' + b + ')';	
		//console.log(colorname);
		let colorname = neopixel.hsl(r,g,b);
		return colorname;
		
	}
	
}