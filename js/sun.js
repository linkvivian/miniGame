//vue模板

new Vue({
  el: '#app',
  data(){
    return{
      number: 10,
      isBegin: true,
      isMask: false,
      score: 0,
      sunPosition: [],
      flags: [],
      sunSpeed: [],
      screen:{
        width: 0,
        height: 0,
      },
    }
  },
  mounted(){
    //根据屏幕大小设置画布大小
    var canvasWidth = Math.floor(document.documentElement.clientWidth);
    var canvasHeight = Math.floor(document.documentElement.clientHeight);
    myCanvas.setAttribute('width',canvasWidth+'px');
    myCanvas.setAttribute('height',canvasHeight+'px');

    const that = this
    window.onresize = () => {
      return (() => {
        that.screen.width = document.body.clientWidth + 'px'
      that.screen.height = document.documentElement.clientHeight + 'px' || document.body.clientHeight + 'px';
    })()
    }
    window.onresize()

  },
  methods:{
    go(){
      //倒计时
      this.isBegin = false
      let timer = setInterval(()=>{
        this.number--
      if(this.number==0){

        clearInterval(timer)
        clearInterval(timer1)

        this.isMask = true;

        let that = this;
        // alert(that.score)
        $.ajax({
          type:'post',
          url:'https://h5.xizhuopt.com/game',
          data: {
            type: false,
            amount: that.score
          },
          success: function () {
            setCode1();
          }
        })
        }
    },1000)

      //canvas
      let myCanvas = document.getElementById("myCanvas")
      let cxt = myCanvas.getContext("2d")

      let canvasWidth = Math.floor(document.documentElement.clientWidth);
      let canvasHeight = Math.floor(document.documentElement.clientHeight);

      //box重画
      function boxRedraw(){
        let boxImg = new Image()
        boxImg.src = '../image/box3.png'
        boxImg.onload = function(){
          cxt.drawImage(boxImg, canvasWidth-sun.boxWidth,canvasHeight-sun.boxHeight)
        }
      }

      boxRedraw()

      var sunScore;
      //太阳 返回一个类（？）
      let Sun = ()=>{
        let sunImg = new Image()
        sunImg.src = '../image/sun.png'

        let o = {
          sunWidth: 50,
          sunHeight: 47,
          boxWidth: 150,
          boxHeight: 114,
          speedX: 20,
          speedY: 20,
        }

        //算出不同太阳的speed
        o.speed = ([x,y],i)=>{
          let speed = 30
          let angle = Math.atan((myCanvas.width-this.sunPosition[i][0]-o.boxWidth/2)/(myCanvas.height-this.sunPosition[i][1]-o.boxHeight))*180/Math.PI
          let speedX = speed*Math.sin(Math.floor(angle)*Math.PI/180)
          let speedY = speed*Math.cos(Math.floor(angle)*Math.PI/180)
          return [speedX,speedY]
        }

        //添加
        o.add = ()=>{
          let x = Math.random()*(myCanvas.width-o.sunWidth)
          let y = Math.random()*(myCanvas.height-o.sunHeight*2-o.boxHeight-200)+200
          let sunImg = new Image()
          sunImg.src = '../image/sun.png'
          sunImg.onload = ()=>{
            cxt.drawImage(sunImg, x, y)
          }
          return [x,y]
        }

        //重画画布
        o.redraw = ()=>{
          cxt.clearRect(0,0,myCanvas.width,myCanvas.height-o.boxHeight)

          for(let i=0; i<this.sunPosition.length; i++){
            if(this.sunPosition[i][0]!=-1){
              cxt.drawImage(sunImg, this.sunPosition[i][0], this.sunPosition[i][1])
            }
          }
        }

        //太阳的移动
        o.move = ([x,y],i)=>{
          let timer2 = setInterval(()=>{
            this.sunPosition[i][0] += this.sunSpeed[i][0]
          this.sunPosition[i][1] += this.sunSpeed[i][1]
          cxt.clearRect(x,y,o.sunWidth,o.sunHeight)
          x+=this.sunSpeed[i][0]
          y+=this.sunSpeed[i][1]

          cxt.drawImage(sunImg, this.sunPosition[i][0], this.sunPosition[i][1])
          o.redraw()

          boxRedraw()
          if(x>myCanvas.width||y+o.sunHeight+o.boxHeight>myCanvas.height-5){
            this.sunPosition[i][0] = -1
            clearInterval(timer2)
            this.score++
            cxt.clearRect(x,y,o.sunWidth,o.sunHeight)
          }

        },1000/30)

        }

        return o
      }

      let sun = Sun()

      //0.3秒产生一个太阳，最大限200个
      let timer1 = setInterval(()=>{
        if(this.sunPosition.length == 200){
        return false
      }else{
        let one = sun.add()
        this.sunPosition.push(one)
        this.flags.push(true)
        this.sunSpeed.push(sun.speed(one,this.sunPosition.length-1))
      }
    },300)

      //监听画布的点击事件
      myCanvas.addEventListener('touchstart',ev=>{
        if(this.number == 0){
        return false;
      }
        for(let i=0; i<this.sunPosition.length; i++){
        if(ev.targetTouches[0].clientX>this.sunPosition[i][0] && ev.targetTouches[0].clientX<this.sunPosition[i][0]+sun.sunWidth && ev.targetTouches[0].clientY>this.sunPosition[i][1] && ev.targetTouches[0].clientY<this.sunPosition[i][1]+sun.sunHeight){
          if(this.flags[i]){
            sun.move(this.sunPosition[i],i)
            this.flags[i] = false
            return false
          }
        }
      }

    })
    },

  },
})


// 游戏结束时，用户同意授权，获取code（在code.js）
//打开授权页面
function setCode1() {
  var imagePage = 'https://h5.xizhuopt.com/picture';
  var pageUrl = imagePage
    .replace(/[/]/g, "%2f")
    .replace(/[:]/g, "%3a")
    .replace(/[#]/g, "%23")
    .replace(/[&]/g, "%26")
    .replace(/[=]/g, "%3d");
  var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
  "wxd53f1cc22f392e66" + "&redirect_uri=" + pageUrl +
  "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
  window.location.href = url;
}
