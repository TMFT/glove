var five = require("johnny-five");
var robot = require("robotjs");

var board = new five.Board();

var screenWidth = robot.getScreenSize().width;
var screenHeight = robot.getScreenSize().height;

var date1 = 0;
var date2 = 0;

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

    var acc = 10;

    console.log(this.gyro.rate.x, this.gyro.rate.y);

    if (this.gyro.rate.x > 15) {
      robot.moveMouse(robot.getMousePos().x+acc, robot.getMousePos().y);
    }
    else if (this.gyro.rate.x < -15) {
      robot.moveMouse(robot.getMousePos().x-acc, robot.getMousePos().y);
    }
    else if (this.gyro.rate.y > 25) {
      robot.moveMouse(robot.getMousePos().x, robot.getMousePos().y+acc);
    }
    else if (this.gyro.rate.y < -25) {
      robot.moveMouse(robot.getMousePos().x, robot.getMousePos().y-acc);
    }

  });

  var click = false;
  var keyToggled = false;
  accelerometerE.on("change", function() {
    if (this.roll < 0 && accelerometerD.z > 0 && click == false) {
      robot.mouseToggle("down","left");
      click = true;
    }
    if (this.roll > 0 && accelerometerD.z > 0 && click == true) {
      robot.mouseToggle("up","left");
      click = false;
    }
    if (this.roll < 0 && accelerometerD.roll < 0 && keyToggled == false) {
      robot.keyTap("e");
      keyToggled = true;
    }
    if (this.roll > 0 && accelerometerD.roll > 0 && keyToggled == true) {
      robot.keyTap("e");
      keyToggled = false;
    }
  });
  accelerometerD.on("change", function() {
    if (this.roll < 0 && accelerometerE.z > 0 && click == false) {
      robot.mouseToggle("down","right");
      click = true;
    }
    if (this.roll > 0 && accelerometerE.z > 0 && click == true) {
      robot.mouseToggle("up","right");
      click = false;
    }
  });

});
