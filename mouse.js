var five = require("johnny-five");
var robot = require("robotjs");

var board = new five.Board();

var screenWidth = robot.getScreenSize().width;
var screenHeight = robot.getScreenSize().height;

var date1 = 0;
var date2 = 0;
var accelPitch1;
var accelPitch2;

robot.moveMouse(screenWidth/2, screenHeight/2);

board.on("ready", function() {
  var imu = new five.IMU({
      controller: "MPU6050"
    });
    var accelerometerE = new five.Accelerometer({
      controller: "ADXL335",
      pins: ["A0", "A1", "A2"]
    });
    var accelerometerD = new five.Accelerometer({
      controller: "ADXL335",
      pins: ["A3", "A6", "A7"]
    });

  imu.on("change", function() {

    var acc = this.accelerometer.acceleration*10;
    var acc_x = this.accelerometer.y*100;
    var acc_y = this.accelerometer.x*-100;

    date1 = date2;
    date2 = new Date().getSeconds() + new Date().getMilliseconds()*0.001;

    var dx = acc_x * Math.pow(date2 - date1, 2);
    var dy = acc_y * Math.pow(date2 - date1, 2);

    dx = (dx*(screenWidth/2))/0.5;
    dy = (dy*(screenHeight/2))/0.5;

    if (acc > 10) {
      robot.moveMouse(robot.getMousePos().x+dx, robot.getMousePos().y+dy);
    }
  });

  var click = false;
  var keyToggled = false;
  accelerometerE.on("change", function() {
    var intervalo = 0.5;
    if (this.z - intervalo < accelerometerD.z && this.z + intervalo < accelerometerD.z && click == false) {
      robot.mouseToggle("down","left");
      click = true;
    }
    if (this.z + intervalo > accelerometerD.z && click == true) {
      robot.mouseToggle("up","left");
      click = false;
    }
  });
  accelerometerD.on("change", function() {
    var intervalo = 0.5;
    if (this.z - intervalo < accelerometerE.z && this.z + intervalo < accelerometerE.z && click == false) {
      robot.mouseToggle("down","right");
      click = true;
    }
    if (this.z + intervalo > accelerometerE.z && click == true) {
      robot.mouseToggle("up","right");
      click = false;
    }
  });
});
