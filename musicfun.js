    var musicfun = function () {
        this.currenttime = 0
        this.musiclist = [
        ]
        this.count = 0
        this.source = null
        this.ac = new (window.AudioContext || window.webkitAudioContext)()
        this.alltime = 100
        this.stop = false
        this.starttime = 0
        this.startoffset = 0
        this.currentsongid = 0
        this.size = 32
        this.end = null
    }
    musicfun.prototype.loadmusicfun = function () {
        var self = this
        var XMLHttpRequest = window.XMLHttpRequest || window.ActiveXObject
        var xhr = new XMLHttpRequest()
        // 设置获取音频，然后连接解析器
        var load = function (url, callback, ispos) {
            var n = ++self.count
            self.source && self.source[self.source.stop ? 'stop' : 'noteOff']()
            if (!ispos) {
                self.currenttime = 0
                self.starttime = 0
            }
            xhr.abort()
            xhr.open('GET', url)
            xhr.responseType = 'arraybuffer'
            console.log(self.stop)
            xhr.onload = function () {
                if (n !== self.count) return
                self.ac.decodeAudioData(xhr.response, function (buffer) {
                if (n !== self.count) return
                self.alltime = buffer.duration
                self.startoffset = self.ac.currentTime
                var bufferSource = self.ac.createBufferSource()
                bufferSource.buffer = buffer
                bufferSource.connect(self.analyser)
                if (ispos) bufferSource[bufferSource.start ? 'start' : 'noteOn'](0, self.currenttime, self.alltime - self.currenttime)
                else bufferSource[bufferSource.start ? 'start' : 'noteOn'](0, self.currenttime, self.alltime)
                bufferSource.onended = function (a, b, c) {
                    self.musicpause()
                    if (self.end) self.end()
                }
                self.source = bufferSource
                console.log(bufferSource)
                if (callback) callback.call(self)
                }, 
                function (err) {
                    console.log(err)
                })
            }
            xhr.send()
        }
        return load
    }
    musicfun.prototype.visualizer = function () {
        var self = this
        console.log(this)
        self.stop = false
        var drawfunobj = this.drawfun()
        var arr = new Uint8Array(this.analyser.frequencyBinCount)
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
        var timev = function () {
            if (self.stop) drawfunobj.drawcap()
            else {
                self.analyser.getByteFrequencyData(arr)
                drawfunobj.draw(arr)
            }
            // window.requestAnimationFrame(v)
        }
        if (this.timer) {
            setInterval(function(){
                window.requestAnimationFrame(timev)
            },this.timer)
        }else{
            var overv = function () {
                if (self.stop) drawfunobj.drawcap()
                else {
                    self.analyser.getByteFrequencyData(arr)
                    drawfunobj.draw(arr)
                }
                window.requestAnimationFrame(overv)
            }
            window.requestAnimationFrame(overv)
        } 
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
            self.currenttime = parseFloat(self.starttime) + parseFloat(self.ac.currentTime) - parseFloat(self.startoffset)
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
                    self.ctx.fillRect(i * w, height - capYPositionArray[i] - self.config.capheight, w * self.config.gaprate, self.config.capheight)
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
    musicfun.prototype.loadmusic =  function (start,first) {
        var self = this
        if (typeof start === 'string') {
            self.currenturl = start
        } else if (typeof start === 'number') {
            self.currentsongid = start
            self.currenturl = self.musiclist[self.currentsongid]['url']
        }
        if (first) {
            self.currenttime = first
        }
        if (self.load) {
            self.musicpause()
            self.load(self.currenturl, self.visualizer, first)
        } else {
            this.load = this.loadmusicfun()
            this.load(this.currenturl, self.visualizer, first)
        }
    },
    musicfun.prototype.musicpause = function () {
        if (!this.source) return console.log('还没有实例') 
        if (!this.stop) {
            this._disconnect()
        } else {
            this._connect()
        }
    },
    musicfun.prototype._disconnect = function () {
        this.starttime = this.currenttime
        this.stop = true
        this.source.disconnect(this.analyser)
    },
    musicfun.prototype._connect = function () {
        this.startoffset = this.ac.currentTime
        this.stop = false
        this.source.connect(this.analyser)
    },
    musicfun.prototype.next = function (id) {
        this.currentsongid++
        if (this.currentsongid > this.musiclist.length - 1) this.currentsongid = 0
        this.loadmusic(this.currentsongid)
    },
    musicfun.prototype.last = function (id) {
        this.currentsongid--
        if (this.currentsongid < 0) this.currentsongid = this.musiclist.length - 1
        this.loadmusic(this.currentsongid)
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
        this.timer = options.timer
    }
    musicfun.prototype.linecolor = function(color){
        if (!this.ctx) return console.log('没有实例canvas')
        this.config.linecolor = color
        this.line = this.ctx.createLinearGradient(0, 0, 0, this.height)
        this.line.addColorStop(0, this.config.linecolor)
        this.line.addColorStop(1, this.config.linecolor)
        console.log(this.cap)
    }
    musicfun.prototype.capcolor = function(color){
        if (!this.ctx) return console.log('没有实例canvas')
        var cap = this.ctx.createLinearGradient(0, 0, 0, this.height)
        this.config.capcolor = color
        cap.addColorStop(0, this.config.capcolor)
        cap.addColorStop(1, this.config.capcolor)
        this.cap = cap
        console.log(this.cap)
    }
export default new musicfun()