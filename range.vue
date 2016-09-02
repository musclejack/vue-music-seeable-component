<template>
    <div class="range">
        <span class="sildebar">
            <span class="sildeleft"  v-bind:style="{ width: parseInt(currentnum)/ parseInt(maxnum)*100+'%' }"></span>
        </span>
        <input class="sildepoint" style="display:none"></input>
    </div>
</template>
<script>
    export default {
        props: ['currentnum','maxnum'],
        data() {
            return{
                
            }
        },
        methods: {
            set: function () {
                this.$parent.currentnum = 15
            }
        }
    }
</script>
<style scoped>

.range{
    width: 100%;
}
.sildebar {
    display: block;
    width: 100%;
    height: 10px;
    position:relative;
    background-color: #eee;
    border-radius: 5px;
}
.sildeleft {
    display: block;
    height: 100%;
    background-color: green;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    border-radius: 5px;
}
.sildepoint {
    position: absolute;
    top: -5px;
    width: 10px;
    height: 10px;
    display: block;
    cursor: pointer;
    background-color: green;
    border-radius: 50%;
    z-index: 3;
    border: 5px solid #fff;
}
</style>