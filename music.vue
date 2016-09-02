<template>
  <div class="musicbox">
    <canvas id="musicwave" width="{{musicwave.width}}" height="{{musicwave.height}}"></canvas>
    <div class="silde" v-if = "silde">
        <range :currentnum = "musicfun.currenttime" :maxnum = "musicfun.alltime"></range>
    </div>
    <div class="control" v-if = "control">
        <span class="presong" @click = "last()"><img src="../assets/logo.png"></span>
        <span class="pause" @click = "musicpause()"><img src="../assets/logo.png"></span>
        <span class="nextsong" @click = "next()"><img src="../assets/logo.png"></span>
        {{parseInt(musicfun.currenttime)}}
    </div>
  </div>
</template>

<script>
import musicfun from './musicfun.js'
import range from './range.vue'
export default {
    props: ['control','silde','musicwave','musiclist','options'],
    ready: function () {
        musicfun.init(this.$el,this.options)
    },
    components: {
        range
    },
    data () {
        return {
            musicfun: musicfun,
        }
    },
    methods: {
        last: function(){
            musicfun.last()
        },
        musicpause: function(){
            musicfun.musicpause()
        },
        next: function(){
            musicfun.next()
        },
        changeconfig: function(config){
            if (config) {
                console.log(musicfun.config)
                for(let item in musicfun.config) {
                    if (config[item]) {
                        musicfun.config[item] = config[item]
                    }
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.control{
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.presong,.nextsong{
    width: 20px;
    height: 20px;
    border-radius: 50%;
}
.presong>img,.nextsong>img,.pause>img{
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.pause{
    width: 36px;
    height: 36px;
    margin: 0 5px;
}
</style>
