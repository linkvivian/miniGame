window.onload = function () {
  getScrollbar();
};
//scrollBar 滚动显示20条信息
function getScrollbar() {
  var url = "https://h5.xizhuopt.com";
  var h = 0, rainScore = 0, sunScore = 0;
  $.ajax({
    type:'get',
    url:url,
    success:function (result) {
      var userArr = result.data;
      for (var i = 0; i < 20; i++){
        if(userArr[i].type){
          rainScore += userArr[h].amount;  //获取所有雨滴数目和
        }else {
          sunScore += userArr[h].amount;  //获取所有太阳数目和
        }
      }
      console.log(rainScore,sunScore)
      //比分条
      compareScore(rainScore, sunScore);

      //计时器,2秒显示一条数据，总共20条
      var timer = setInterval(function myTimer(){
        var lastTime = userArr[h].time;
        switch (true)
        {
          case lastTime < 60:
            lastTime = "5秒";
            break;
          case lastTime <= 900:
            lastTime = "1分钟";
            break;
          case lastTime <= 1800:
            lastTime = "10分钟";
            break;
          default:
            lastTime = "30分钟";
        }
        //时间段
        if(userArr[h].type){
          $('.scrollbarBox').html(userArr[h].nickname + lastTime + '前祈雨' + userArr[h].amount + '点');
          rainScore += userArr[h].amount;  //获取所有雨滴数目和
        }else {
          $('.scrollbarBox').html(userArr[h].nickname + lastTime + '前捐太阳' + userArr[h].amount + '个');
          sunScore += userArr[h].amount;  //获取所有太阳数目和
        }
        h++;
        if(h >= 20){
          myStopFunction();
          h = 0;
          getScrollbar();
        }
      },3000);
      //清除定时器
      function myStopFunction() {
        clearInterval(timer);
      }
    }
  })
}
//----------------------------------------
//score雨滴和太阳的比分
function compareScore(rainScore, sunScore) {
  var sum = rainScore + sunScore;
  $('.sun').html(sunScore);
  $('.sun').width(sunScore / sum * 100 + '%');
  $('.rain').html(rainScore);
  $('.rain').width(rainScore / sum * 100 + '%');
}





