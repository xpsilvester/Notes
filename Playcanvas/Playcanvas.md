# PlayCanvas

## 基本介绍

- PlayCanvas就是一个基于WebGL的游戏引擎，结合了物理、光影、音效等工具用于创建一个复杂的界面。

## [相关视频教程](https://www.bilibili.com/video/av40314818/)

## [相关手册、文档](https://developer.playcanvas.com/zh/)

## [相关API](https://developer.playcanvas.com/en/api/)

## [相关案例](https://developer.playcanvas.com/zh/tutorials/)

- 摄像头随着鼠标、手指移动： [Capturing a screenshot](https://developer.playcanvas.com/zh/tutorials/capturing-a-screenshot/)  在Camera中按顺序添加以下Script：orbit-camera.js、mouse-input.js、touch-input.js
- 项目启动初始动画： [Advance loading screen](https://developer.playcanvas.com/zh/tutorials/advance-loading-screen/) 左下角设置->loading screen 添加loading.js (付费后才能设置)
- 添加动画animation： [混合动画](https://developer.playcanvas.com/zh/tutorials/animation-blending/)  需要在animation的assets中导入相关的动画模型
- 添加自定义web的UI界面： [HTML/CSS - Live Updates](https://developer.playcanvas.com/zh/tutorials/htmlcss---live-updates/) 新建一个entity 然后添加ui.js 在ui.js中加入html和css
- [iPhone6 模型案例](https://playcanvas.com/project/324696/overview/introducing-iphone-6)
- [使用PlayCanvas制作一个简单的小游戏（一）](https://blog.csdn.net/christiedong10/article/details/51648314)

## 项目记录

- 如何确定点击位置？

  ```js
  //以触摸事件为例，鼠标点击事件类似
  Ui.prototype.initialize = function () {
      if (this.app.touch) {
          this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouch, this);
      }
  }
  //按屏事件
  Ui.prototype.onTouch = function () {
      var x = event.touches[0].x; //点击x坐标
      var y = event.touches[0].y; //点击y坐标
  }
  ```

- 如何确定物体位置？

  ```js
  var point = pc.app.root.findByName(entityName); //获取entity
  var p = point.getPosition(); //entit点3D坐标
  var coords = new pc.Vec3(); //新建坐标
  this.camera.camera.worldToScreen(p, coords);//圆点屏幕坐标赋值 worldToScreen这个api就是把物体的3D坐标转化成2D屏幕位置：coords.x 即x坐标，coords.y 即y坐标。将屏幕坐标转成3D坐标可参考screenToWorld
  ```

  

- 如何判断物体被点击？

  ```js
  //entity点击事件函数封装
  Ui.prototype.onTouch = function(event){
      var x = event.touches[0].x; //点击x坐标
      var y = event.touches[0].y; //点击y坐标
      this.entityEvent('光点',x,y,function(){
  		console.log('点中圆点了');
  	});
  }
  Ui.prototype.entityEvent = function(entityName,touchX,touchY,fn){
      var point = pc.app.root.findByName(entityName);
      var p = point.getPosition(); //entit点3D坐标
      var coords = new pc.Vec3(); //新建坐标
      this.camera.camera.worldToScreen(p, coords);//圆点屏幕坐标赋值  
      var dx = touchX - coords.x; //点击位置与圆点x轴距离
      var dy = touchY - coords.y; //点击位置与圆点y轴距离
      var lenSqr = dx*dx + dy*dy; //点击位置与圆点距离
      console.log('点击位置与圆点距离',lenSqr);
      if(lenSqr < 10){
          fn();
      }
  };
  ```

- 如何设置light和model的显示隐藏？

  ```js
  //light
  var light = pc.app.root.findByName('光点'); 
  light.enabled = false;//隐藏
  light.enabled = true;//显示
  //model
  var Model = pc.app.root.findByName('模型'); 
  Model.model.hide();//隐藏
  Model.model.show();//显示
  ```

- 如何获取和设置模型的位置(x,y,z)和放大系数(scale)?

  ```js
  var model = pc.app.root.findByName('模型');
  var y = model.localPosition.y; //模型当前高度
  var x = model.localPosition.x; //模型当前x轴
  var z = model.localPosition.z; //模型当前z轴
  model.setPosition(x,y,z); //设置x,y,z的值
  
  var scaleX = model.localScale.x; //模型当前x轴放大系数
  var scaleY = model.localScale.y; //模型当前y轴放大系数
  var scaleZ = model.localScale.z; //模型当前z轴放大系数
  model.setLocalScale(scaleX,scaleY,scaleZ); //设置放大系数x,y,z
  ```

- 如何获取和设置摄像头(视角)？

  ```js
  Ui.attributes.add('camera', {type: 'entity'}); //把Camera绑定在js中
  this.orbitCamera = this.camera.script.orbitCamera; //请确认Camera已经绑定了orbit-camera.js 参考相关案例第一点
  var distance = this.orbitCamera.distance; //摄像头与物体距离
  var pitch = this.orbitCamera.pitch; //水平偏移角度
  var yaw = this.orbitCamera.yaw; //转动角度
  
  //设置视角
  this.orbitCamera.distance = distance;
  this.orbitCamera.pitch = pitch;
  this.orbitCamera.yaw = yaw;
  ```

- 如何控制物体平滑移动，摄像头(视角)平滑移动？pc.math.lerp

  ```js
  Ui.prototype.update = function(){
      var model = pc.app.root.findByName('模型');
      //控制物体x轴平滑移动 当前 -> 10
      var x = model.localPosition.x; //模型当前x轴
      var y = model.localPosition.y; //模型当前高度
      var z = model.localPosition.z; //模型当前z轴
      var x1 = pc.math.lerp(x, 10, 0.4); //用pc.math.lerp(当前值，目标值，系数（0-1）)平滑设定新值
      model.setPosition(x1,y,z);
      
      //控制摄像头（视角）转动(yaw) 当前 -> 100
      this.orbitCamera = this.camera.script.orbitCamera;
      var yaw = this.orbitCamera.yaw; //转动角度
      var yaw1 = pc.math.lerp(yaw, 100, 0.1); //用pc.math.lerp(当前值，目标值，系数（0-1）)平滑设定新值
      this.orbitCamera.yaw = yaw1;
  }
  ```

  