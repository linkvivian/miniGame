// function GetRequest() {
//   var url = location.search; //获取url中"?"符后的字串
//   if (url.indexOf("?") != -1) {    //判断是否有参数
//     var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
//     strs = str.split("=");   //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
//     return strs[1];          //返回直接弹出第一个参数 （如果有多个参数 还要进行循环的）
//   }
// }
//
// //用户授权后跳转到这个页面就把code传过去，把这个js文件引入游戏页面
// var code; //记录刚进入游戏页面时的code
// window.onload = function () {
//   code =  GetRequest();
// }
//。。。一开始就。。。


var num = 0;

$(document).ready(function () {
  // var num = 0 // 计数器
  var left = 0, top = 0; //碗的位置
  var rainTimer = null;
  // var time = 3;
  //开启3的倒计时

  //count 倒计时
  //@time : 时间
  //@onCountdownOver : 倒计时结束触发的方法，可以接收到当前的time值
  //@onStep : 每减少一时触发的方法，可以接收到当前的time值
  function count(time, onCountdownOver, onStep) {
    var clock = setInterval(go, 1000);
    function go() {
      onStep && onStep(time);
      if (time <= 0) {
        clearInterval(clock);
        onCountdownOver && onCountdownOver(time);
      }
      time--;
    }
  }
  //updateCount 更新id为sample的盒子内的内容
  // @innerHTML 即将更新的内容
  function updateCount(innerHTML) {
    $("#sample").html(innerHTML);
  }
  // 第一次倒计时结束时执行的方法
  function onFirstCountdownOver() {
    count(10, onSecondCountdownOver, updateCount);

    $('#guide').empty();
    var collected = '<div class="has">已收集的雨滴</div>'
    $('#guide').append(collected);
    rain();
  }
  // 第二次倒计时结束时执行的方法
  function onSecondCountdownOver() {
    // alert("你已求得"+num+"滴雨");
    clearInterval(rainTimer);
    gameOver();
    // location.reload();
    //$("#profile").remove();
  }
  //isCrash 判断是否在碗里
  //@top：  当前雨滴的top值
  //@left： 当前雨滴的left值
  function isCrash(left,top,height,width) {
    var obj = $("#bowl").position();
    var bowLeft = obj.left;
    var bowTop = obj.top;
    left = left+width/2
    top = top+height/2
    if(left>=bowLeft&&left<=(bowLeft+$("#bowl").innerWidth())&&top>=bowTop){
      num++;
      var rainnum = '<div class="rnum">已收集的雨滴' + num + '</div>';
      $('.has').html(rainnum);
      return true;
    }
    return false;
  }
  let id = 1;

  // 创建雨滴
  function creatRaindrop(maxW = 23) {
    var maxLeft = $("#raindrop").width();
    var width = maxW;//固定宽度
    var left = Math.random() * (maxLeft - width);//随机left值
    var raindrop = new Raindrop(left, 0, width, width,id);
    id++;
    raindrop.show();
    raindrop.drop(80);
  }

  //雨滴类
  function Raindrop(left, top, width, height,id) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.id = id;
    this.timer = null;
  }
  //雨滴显示
  Raindrop.prototype.show = function () {
    var item = '<div class="com rain' + this.id + '" style="left:' + this.left + 'px;height:' + this.width + 'px;z-index:99">' +
      '<img src="../image/rain.png" style="width:' + this.width + 'px"></div>';
    $("#raindrop").append(item);
    this.op = $(".rain"+this.id)
  }
  //开始下落
  Raindrop.prototype.drop = function (speed) {
    var that = this;
    var winH = $("#raindrop").height();
    var op = this.op;
    var maxH = winH - op.height();//雨滴下落的高度，页面高度加上自身高度就能看到完全落到最底部
    // var init = that.top;

    this.timer=setInterval(function(){
      if(that.top>=maxH||isCrash(that.left,that.top,that.height,that.width)){
        // console.log("over");
        op.remove();
        clearInterval(that.timer);
      }
      that.top+=30;
      op.css({
        top:that.top
      })
    },speed);

  }
  //雨滴停止
  Raindrop.prototype.stop = function () {
    clearInterval(this.timer);
  }
  //雨滴隐藏
  Raindrop.prototype.hide = function () {
    this.op.remove();
  }


  //下雨
  function rain() {
    rainTimer = setInterval(creatRaindrop,100);
  }
  //碗移动


  /*function move() {
      //更新x，y ，同时修改界面中碗的位置

      $(document).mousemove(function(e){
          $("#bowl").css("left",e.pageX-"20"+"px");
      })

  }*/

  $("#bowl").click(function(){
    move();
    count(3, onFirstCountdownOver, updateCount);
  });
  $("#bowl").click(function(){
    $("#bowl").unbind();
  })


  //游戏结束时，跳转到对应链接，生成图片
  function gameOver() {
  var url = 'https://h5.xizhuopt.com/game';
  $.ajax({
    type:'post',
    url:url,
    data: {
      type: true,
      amount: num
    },
    success: function () {
      setCode();
    }
  })
}
});

// 游戏结束时，用户同意授权，获取code（在code.js）
// https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842（微信开发文档）
//   打开授权页面
function setCode() {
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

//----------------------------------------------------------------------------------------------------------





