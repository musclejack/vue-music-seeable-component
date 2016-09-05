# vue-music-seeable-component
[查看演示](https://musclejack.github.io/musicseeable)

简单用法，把这三个文件放到同一文件夹，import musicfun就可以了
调用方法主要为this.$children[0].musicfun[api]
api为组件的方法,this.$children[0]为组件，估计大家都懂，0看大家情况而定
基本配置如下：
```
 <music :silde = "silde" :control = "control" :musicwave = "musicwave" :musiclist = "musiclist" :options = "options"></music>
data () {
    return {
        silde: true,//是否开启进度条
        control: true,//是否开启控制框
        musicwave: {  //canvas的高宽
            width: 320,
            height: 200
        },
        options: { //配置文件
            config: {
                linecolor : '#359F60',//柱条颜色
                gaprate: 0.5,//柱条间距比例
                speed: 1,//帽头下降速度相对（）
                capheight: 3,//帽头高度
                capcolor: '#359F60'//帽头颜色
            },
            musiclist: [//播放的列表，格式参照这里
                {url:'./url'},
                {url:'./url'}
            ],
            size: 64 //柱条的个数
        },
    }
}
```
#### 基本提供方法
播放指定的音乐：this.$chidren[0].musicfun.loadmusic(index);index为第几首歌；也可以传入对应的url；
#### 播放钩子(只需要把相应的函数赋值给相应的钩子，适当的时候就会触发)
    可以播放且开始播放前触发canplay钩子，用法：
    this.$chidren[0].musicfun.canlpay = funcition(){}
    播放结束时触发end钩子，用法：
    this.$chidren[0].musicfun.end = funcition(){}
#### 设置播放进度
this.$chidren[0].musicfun.audio.currentTime = time就可以改变播放进度
#### 获取相应的时间参数，目前播放时间和歌曲总时长。
不建议使用this.$chidren[0].musicfun.audio.currentTime 和this.$chidren[0].musicfun.audio.duration（不会自动更新）    
推荐使用this.$chidren[0].musicfun.currentTime 和 $chidren[0].musicfun.duration ,会自动更新。    
#### 设置相应颜色
设置帽头颜色this.$chidren[0].musicfun.capcolor(color);调用这和函数传入颜色参数    
设置柱条颜色this.$chidren[0].musicfun.lincolor(color);调用这和函数传入颜色参数    
#### 可以动态改变的值：
data里的options.config的值，都会赋值给this.$chidren[0].musicfun.config，想改变相应的样式可以这么做    
如：this.$chidren[0].musicfun.config.gaprate = 0.7(把间隔比例改为0.7)    
如：this.$chidren[0].musicfun.config.capheight = 6(把帽头高度改为6)    
#### 控制方法
上一曲方法this.$chidren[0].musicfun.last();也可以调用子组件的方法this.$chidren[0].last();推荐前者    
下一曲方法this.$chidren[0].musicfun.next();也可以调用子组件的方法this.$chidren[0].next();推荐前者    
暂停方法this.$chidren[0].musicfun.pause();也可以调用子组件的方法this.$chidren[0].pause();推荐前者    
