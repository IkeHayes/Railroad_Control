/*! MotorControl | (c) 2015, 2015 Isaac Hayes | GNU Pulblic License */

//===================
//JQueery Test
//===================

$(document).ready(function() {
	$("button[name='test_button']").click(function() {
		$("#test_span").text("Oh yeah!");
	});
	console.log("Tested the spans!");
});

//===================
//Red LED Button Events
//===================
function f_ROff() {
	document.getElementById("link_ROff").click();
}

function f_ROn() {
	document.getElementById("link_ROn").click();
}

//===================
//Set Green Value
//===================
$(function() {
	$("button[name='set_green']").click(function() {
	  $.getJSON($SCRIPT_ROOT + '/_set_green', {
	    green_pwm: $("input[name='green_percent']").val(),
	    b: $("input[name='green_percent']").val()
	  	}, function(data) {
	  		$("#green_span").text(data.result + "%");
	  		$("#pwmValue").text(data.result);
	  		mySlider.setValue(data.result);
	  });
	  console.log("Triggered set_green");
	  return false;
	});
});

//===================
// Slider Object
//===================

//Slider Initialization
var mySlider, i=0;
function doOnLoad(){
	//mySlider = new dhtmlXSlider("sliderObj", 250, "dhx_skyblue", false, 1, 100, 1, 1);
	mySlider = new dhtmlXSlider({
		parent: "sliderObj",
		size: 250,
		value: 0,
		step: 5,
		min: 0,
		max: 100
	});

	mySlider.attachEvent("onChange", function(value){
		sliderChange({
			eventNme: "onChange",
			arg: value
		});
	});
}

//Clean Up
function doOnUnload(){
	if (mySlider != null){
		mySlider.unload();
		mySlider = null;
	}
}

//On Change Event
function sliderChange(slider_data){
	$("#pwmValue").text(slider_data.arg);
	$.getJSON($SCRIPT_ROOT + '/_set_green', {
		green_pwm: slider_data.arg,
	    b: slider_data.arg
	}, function(data) {
	  	$("#green_span").text(data.result + "%");
	});
}