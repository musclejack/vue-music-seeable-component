<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png">
    <music :url = "" :silde = "true" :control = "control" :musicwave = "musicwave" :musiclist = "musiclist" :options = "options"></music>
    <div class="test-box">
    <div class="input"><input v-model = "capheight" placeholder="capheight"></input></div>

    <div class="input"><input v-model = "speed" placeholder="speed"></input></div>
    
    <div class="input"><input v-model = "linecolor" placeholder="linecolor"></input></div>
   
    <div class="input"><input v-model = "capcolor" placeholder="capcolor"></input></div>
    
    <button class="test-btn" @click = "setcolor">改变颜色</button>
    
    <div class="input"><input v-model = "start" placeholder="start"></input></div>
    
    <button class="test-btn" @click = "setstart">改变时间</button>
    </div>
  </div>
</template>

<script>
import music from './music/music'

export default {
    components: {
        music
    },
    ready: function(){
        var self = this
        this.$children[0].musicfun.end = function() {
            self.$children[0].musicfun.next()
        }
        this.$children[0].musicfun.loadmusic(0)
    },
    data() {
        return {
            control: true,
            musicwave: {
                width: 400,
                height: 200
            },
            options: {
                config: {
                    linecolor : 'red',
                    gaprate: 0.5,
                    speed: 1,
                    capheight: 3,
                    capcolor: '#000'
                },
                musiclist: [
                    {url:'./static/music/Jamillions - One Night.mp3', name:'Jamillions - One Night.mp3'},
                    {url:'./static/music/李治廷 - Echoes of the Rainbow.mp3', name:'李治廷 - Echoes of the Rainbow.mp3'},
                    {url:'./static/music/岸部眞明 - 流れ行く云.mp3', name:'岸部眞明 - 流れ行く云.mp3'}
                ],
                timer: 10,
                size: 64
            },
            linecolor: null,
            capcolor: null,
            capheight: null,
            speed: null,
            start: null
        }
      },
    watch: {
        capheight : function (a,b) {
            this.$children[0].musicfun.config.capheight = parseFloat(a)
        },
        speed : function (a,b) {
            this.$children[0].musicfun.config.speed = parseFloat(a)
        }
    },
    methods: {
        setcolor : function () {
            if (this.linecolor) this.$children[0].musicfun.linecolor(this.linecolor)
            if (this.capcolor) this.$children[0].musicfun.capcolor(this.capcolor)
        },
        setstart : function () {
            this.$children[0].musicfun.loadmusic(this.$children[0].musicfun.loadmusic.currentsongid, parseFloat(this.start))
        }
    }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  width: 400px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}
.test-box {
    width: 100%;
    background-color: #eee;
}
.test-btn {
    width: 50%;
    height: 38px;
    background-color: #05AE87;
    border-radius: 5px;
    border-width: 0;;
    cursor: pointer;
    margin-bottom: 2px;
}
.input{
    width: 100%;
    height: 35px;
    position: relative;
}
.input input{
    border-radius: 15px;
    text-align: center;
    transition: width 0.5s;
    -moz-transition: width 0.5s;  /* Firefox 4 */
    -webkit-transition: width 0.5s; /* Safari 和 Chrome */
    -o-transition: width 0.5s;
    width: 50%;
    height: 80%;
    display: block;
    margin: 0 auto;
    border: 1px solid #ccc;
    opacity: 0.7;
}
.input input:focus{
  width: 55%;
  transition: width 0.5s;
  -moz-transition: width 0.5s;  /* Firefox 4 */
  -webkit-transition: width 0.5s; /* Safari 和 Chrome */
  -o-transition: width 0.5s;
  -webkit-tap-highlight-color: transparent;
  tap-highlight-color: transparent;
  border:none;
  outline:medium;
  opacity: 1;
}
</style>
