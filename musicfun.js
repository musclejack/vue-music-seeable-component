    var musicfun = function () {
        this.musiclist = [
        ]
        this.source = null
        this.ac = new (window.AudioContext || window.webkitAudioContext)()
        this.currentSongId = 0
        this.size = 32
        this.end = null
        this.currentTime = 0
        this.duration = 0
    }
    musicfun.prototype.loadmusicfun = function () {
        var self = this
        //音乐初始化
        var loadAudioElement = function (url) {
            return new Promise(function(resolve, reject) {
                self.audio = new Audio();
                self.audio.addEventListener('canplay', function() {
                    /* Resolve the promise, passing through the element. */
                    if (self.canplay) self.canplay()
                    resolve(self.audio);
                });
                /* Reject the promise on an error. */
                self.audio.addEventListener('error', reject);
                self.audio.src = url;
                self.audio.crossOrigin = 'anonymous';
            });
        }
        //音乐基本设置
        var canplay = function (audio) {
            self.source = self.ac.createMediaElementSource(audio)
            audio.onended = function() {
                self.source.disconnect()
                self.source = null
                if (self.end) self.end()
            }
            self.source.connect(self.analyser)
            // self.source.connect(self.ac.destination)初始化时候做了
            self.duration = audio.duration
            audio.play()
        }
        var rejectfun = function (reject) {
            console.log(reject)
        }
        var docallback = function (callback) {
            return function () {
                if(callback) callback.call(self)
            } 
        }
        //返回的函数
        var load = function (url,callback) {
            loadAudioElement(url).then(canplay,rejectfun).then(docallback(callback),rejectfun)
        }
        return load
    }
    musicfun.prototype.visualizer = function () {
        var self = this
        var drawfunobj = self.drawfun()
        var arr = new Uint8Array(this.analyser.frequencyBinCount)
        var overv
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
        self.stop = false
        overv = function () {
            if (self.stop) drawfunobj.drawcap()
            else {
                self.analyser.getByteFrequencyData(arr)
                drawfunobj.draw(arr)
            }
            window.requestAnimationFrame(overv)
        }
        window.requestAnimationFrame(overv) 
    }
    musicfun.prototype.drawfun = function () {
        var self = this
        var canvas = this.el.getElementsByTagName('canvas')[0]
        var height = canvas.height 
        var width = canvas.width 
        this.height = height
        this.width = width
        var w = width / self.size
        var ctx = canvas.getContext('2d')
        self.ctx = ctx
        var capYPositionArray = []

        var line = this.ctx.createLinearGradient(0, 0, 0, height)
        line.addColorStop(0, self.config.linecolor)
        line.addColorStop(1, self.config.linecolor)
        var cap = this.ctx.createLinearGradient(0, 0, 0, height)
        cap.addColorStop(0, self.config.capcolor)
        cap.addColorStop(1, self.config.capcolor)
        self.line = line
        self.cap = cap

        var draw = function (arr) {
            self.currentTime = self.audio.currentTime
            self.ctx.clearRect(0, 0, width, height)
            for (var i = 0; i < self.size; i++) {
                var h = arr[i] / 256 * height
                if (capYPositionArray.length < Math.round(self.size)) {
                    capYPositionArray.push(h)
                }
                self.ctx.fillStyle = self.cap
                if (h < capYPositionArray[i]) {
                    capYPositionArray[i] = capYPositionArray[i] - self.config.speed
                    if (capYPositionArray[i] <= 0) capYPositionArray[i] = 0
                    self.ctx.fillRect(i * w, height - self.config.capheight- capYPositionArray[i], w * self.config.gaprate, self.config.capheight)
                } else {
                    self.ctx.fillRect(i * w, height - h - self.config.capheight, w * self.config.gaprate, self.config.capheight)
                    capYPositionArray[i] = h
                }
                self.ctx.fillStyle = self.line
                self.ctx.fillRect(w * i, height - h + 1, w * self.config.gaprate, h)
            }
        }
        var drawcap = function () {
            self.ctx.clearRect(0, 0, width, height)
            self.ctx.fillStyle = self.cap
            for (var i = 0; i < capYPositionArray.length; i++) {
                if (capYPositionArray[i] <= 0) capYPositionArray[i] = 0
                else capYPositionArray[i] = capYPositionArray[i] - self.config.speed
                self.ctx.fillRect(i * w, height - capYPositionArray[i] - self.config.capheight - 1, w * self.config.gaprate, self.config.capheight)
            } 
        }
        return {
            draw: draw,
            drawcap: drawcap
        }
    }
    musicfun.prototype.loadmusic =  function (start) {
        var self = this
        if (typeof start === 'string') {
            self.currentUrl = start
        } else if (typeof start === 'number') {
            self.currentSongId = start
            self.currentUrl = self.musiclist[self.currentSongId]['url']
        }
        if (self.load) {
            self._disconnect()
            self.load(self.currentUrl, self.visualizer)
        } else {
            self.load = self.loadmusicfun()
            self.load(self.currentUrl, self.visualizer)
        }
    }
    musicfun.prototype.pause = function () {
        if (!this.audio) return console.log('没有实例') 
        if (this.stop) {
            this._connect()
        } else {
            this._disconnect()
        }
    }
    musicfun.prototype._disconnect = function () {
        this.audio.pause()
        this.stop = true
    }
    musicfun.prototype._connect = function () {
        this.audio.play()
        this.stop = false
    }
    musicfun.prototype.next = function (id) {
        this.currentSongId++
        if (this.currentSongId > this.musiclist.length - 1) this.currentSongId = 0
        this.loadmusic(this.currentSongId, 0)
    }
    musicfun.prototype.last = function (id) {
        this.currentSongId--
        if (this.currentSongId < 0) this.currentSongId = this.musiclist.length - 1
        this.loadmusic(this.currentSongId, 0)
    }
    musicfun.prototype._init = function(){
        var ac = this.ac
        var gainNode = ac[ac.createGain ? 'createGain' : 'createGainNode']()
        gainNode.connect(ac.destination)
        var analyser = ac.createAnalyser()
        analyser.fftSize = 256
        analyser.connect(gainNode)
        this.analyser = analyser
    }
    musicfun.prototype.init = function(el,options){
        this._init()
        this.el = el
        this.config= {
            linecolor : '#ccc',
            gaprate: 0.5,
            speed: 1,
            capheight: 3,
            capcolor: '#000'
        }
        if (options.config) {
            for(var item in this.config) {
                if (options.config[item]) {
                    this.config[item] = options.config[item]
                }
            }
        }
        this.size = options.size?options.size:this.size
        this.musiclist = options.musiclist
    }
    musicfun.prototype.linecolor = function(color){
        if (!this.ctx) return console.log('没有实例canvas')
        this.config.linecolor = color
        this.line = this.ctx.createLinearGradient(0, 0, 0, this.height)
        this.line.addColorStop(0, this.config.linecolor)
        this.line.addColorStop(1, this.config.linecolor)
    }
    musicfun.prototype.capcolor = function(color){
        if (!this.ctx) return console.log('没有实例canvas')
        this.config.capcolor = color
        this.cap = this.ctx.createLinearGradient(0, 0, 0, this.height)
        this.cap.addColorStop(0, this.config.capcolor)
        this.cap.addColorStop(1, this.config.capcolor)
    }

export default new musicfun()