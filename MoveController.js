#pragma strict

public var force:float = 1.0;
public var simulateAccelerometer:boolean = false;
public var touchedBy:boolean = false;
var dir : Vector3 = Vector3.zero;
var endPoint = 0.0; 
var touch : Touch;
var fingerCount = 0;

private var myTransform : Transform;
private var startTime : float;

static var Slowdown : int = 0;
static var maxSlowdown : float = 18000.0;
var speed : float = 2.4;
static var isSlowing : boolean = false;
static var speedingUp : int = 1;

static var controlMultiplier : float = 1;

var mainCamera : GameObject;
var script : ScoreController;

var SpeedLinesTexture : GameObject;
var SpeedLinesTextureScript : GUITextureLaunch;

var SpeedLinesMesh : GameObject;
static var SpeedLinesMeshScript : SpeedLines;

var audioSource : AudioSource;

var changingPitch : boolean = false;
var shouldChangePitch : boolean = true;

static var pauseButtonArea : Rect;

function Awake() {
	myTransform = transform;
	script = GetComponent("ScoreController");
	SpeedLinesTextureScript = SpeedLinesTexture.GetComponent("GUITextureLaunch");
	SpeedLinesMeshScript = SpeedLinesMesh.GetComponent("SpeedLines");
}


function Start() {

//	Screen.sleepTimeout = 0.0f;
//	deprecated, now should use NeverSleep
	Screen.sleepTimeout = SleepTimeout.NeverSleep;
    startTime = Time.time; 
	Slowdown = FallingLaunch.levelEndSlowdown;

	mainCamera = transform.FindChild("Camera").gameObject;
	audioSource = mainCamera.GetComponent.<AudioSource>();

	//Calibrate();

	lerpSlowdown(.5);
	lerpControl(3);
	//pauseButtonArea = Rect(0, 0, Screen.width / 2, Screen.height / 2);
	pauseButtonArea = Rect(Screen.width * .9, Screen.height * .8, Screen.width * .1, Screen.height * .2);
}

function FixedUpdate () {
	var dir : Vector3 = Vector3.zero;
		
//	if (simulateAccelerometer)
//	{
		// using joystick input instead of iPhone accelerometer
//		dir.x = Input.GetAxis("Horizontal");
//		dir.z = Input.GetAxis("Vertical");
//	}
//	else

		// we assume that device is held parallel to the ground
		// and Home button is in the right hand
		
		// remap device acceleration axis to game coordinates
		// 1) XY plane of the device is mapped onto XZ plane
		// 2) rotated 90 degrees around Y axis
 //		 dir.x = -Input.acceleration.y;
//		 dir.z = Input.acceleration.x;

//		 print("Your X and Z accel are: " + dir.x + ", " + dir.z);

		// clamp acceleration vector to unit sphere
//		if (dir.sqrMagnitude > 1)
//			dir.Normalize();

if (FallingPlayer.isAlive == 1 && FallingLaunch.tiltable == true) {

	// Make it move 10 meters per second instead of 10 meters per frame...
	// .:. not necessary in fixedupdate
    // dir *= Time.deltaTime;
    // print("Your dir is: " + dir);     
    
    //myTransform.Translate (dir * speed, Space.World);
    FallingLaunch.hasSetAccel = true;
    FallingLaunch.accelerator = FallingLaunch.calibrationRotation * Input.acceleration;
    //Debug.Log(FallingLaunch.accelerator);
    dir.x = 4 * FallingPlayer.isAlive * controlMultiplier * FallingLaunch.flipMultiplier * -((FallingLaunch.accelerator.y) * Mathf.Abs(FallingLaunch.accelerator.y));
	dir.z = 3 * FallingPlayer.isAlive * controlMultiplier * FallingLaunch.flipMultiplier * ((FallingLaunch.accelerator.x) * Mathf.Abs(FallingLaunch.accelerator.x));

	dir.x = FallingLaunch.invertHorizAxisVal * Mathf.Clamp(dir.x, -2.0, 2.0);
	dir.z = FallingLaunch.invertVertAxisVal * Mathf.Clamp(dir.z, -2.0, 2.0);

    myTransform.Translate (dir * speed, Space.World);
}

else {dir = Vector3.zero;}

}

function SmoothSlowdown () {

	isSlowing = true;    
    iTween.ValueTo ( gameObject,
        {
            "from" : maxSlowdown,
            "to" : 0,
            "onupdate" : "ChangeSpeed",
            "time" : 1,
            "easetype": "easeOutExpo",
            "oncomplete": "ResumeSpeed"
       }
    );

}

function ChangeSpeed ( i : int ) {
Slowdown = i;
//	Debug.Log("Your current speed score is " + ScoreController.visibleScore);
}

function ResumeSpeed () {
isSlowing = false;
}

function Update () {
	fallingSpeed();
//	Debug.Log("Slowdown = " + Slowdown);
}

// I also tried moving fallingSpeed function to fixedUpdate, but it actually made the game slower,
// since iOS is usually 30fps and fixedUpdate needs to run at 50fps (0.02 fixed timestep) for
// decent collision detection.

function fallingSpeed () {

	fingerCount = 0;
	
	if (FallingPlayer.isAlive == 1 && FallingPlayer.isPausable == true) {
	    //for (touch in Input.touches) {
	    //	if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled) {
	    for (var i = 0; i < Input.touchCount; ++i) {
			if (Input.GetTouch(i).phase != TouchPhase.Ended && Input.GetTouch(i).phase != TouchPhase.Canceled) {	    		
	    		fingerCount++;

				if (pauseButtonArea.Contains(Input.GetTouch(i).position)) {
					// Debug.Log("Returning!");
					return;
				}

	    		// if (pauseButtonArea.Contains(touch.position)) {
	    		// 	Debug.Log("Touching pause area!");
	    		// }
	    		// else {
	    		// 	Debug.Log("Not in pause area.");
	    		// }	    		
	    	}
		}
	
			
		if (fingerCount > 0) { 	
			//speedUp();
			if (Slowdown < 1) {speedingUp = 2; Slowdown = maxSlowdown; speedsUp();
				//GA.API.Design.NewEvent("Control:SpeedBoost:Start:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea, FallingLaunch.secondsAlive, transform.position);
			}
			//if (Slowdown < 1) 
			//{speedingUp = 2; speedsUp(); Slowdown = maxSlowdown; }
			
		}
	    else if (fingerCount < 1) {
	//    	slowDown();
			//if (Slowdown > 0) {speedDown(); yield;}
			//Slowdown = 0;
			if (Slowdown > 0) { speedingUp = 0; speedsUp(); lerpSlowdown(.5); }
			//else if (Slowdown > 0) {speedingUp = 0; speedsUp(); }
	    }
	}

	else {
		Slowdown = 0;
		speedingUp = 1;
		//SpeedLinesTextureScript.LinesOff();
		SpeedLinesMeshScript.LinesOff();
		//mainCamera.audio.pitch = 1;
		//mainCamera.audio.volume = 1;
		if (shouldChangePitch == true && changingPitch == false) {lerpPitchDown(.5, 1, 1);}
		dir = Vector3.zero;
		FallingPlayer.UIscriptComponent.hideThreatBar(0.1);
	}

//  Debug.Log("Slowdown = " + Slowdown + ", speedingUp = " + speedingUp );
//	Debug.Log("You have " + fingerCount + " fingers touching the screen." );

	GetComponent.<ConstantForce>().relativeForce = (Vector3.down * Slowdown);
}

function speedsUp () {
		if (speedingUp == 2) {
		speedingUp = 1;
		//SpeedLinesTextureScript.LinesFlash (0.25, FadeDir.In);
		SpeedLinesMeshScript.LinesFlash (0.25, FadeDir.In);
		FallingPlayer.UIscriptComponent.showThreatBar(1);
		if (audioSource && shouldChangePitch == true) {lerpPitchUp(.5, 2, .3);}
		}
		else {
		//SpeedLinesTextureScript.LinesFlashOut (0.75, FadeDir.In);
		SpeedLinesMeshScript.LinesFlashOut (0.5, FadeDir.In);
		FallingPlayer.UIscriptComponent.hideThreatBar(.5);
		if (audioSource && shouldChangePitch == true && changingPitch == false) {lerpPitchDown(1, 1, 1);}
}		
}

function speedUp () {
		Slowdown = maxSlowdown;        
		Camera.main.SendMessage("speedLinesUp");
//		SendMessage is slow; rephrase if I ever use this speedUp method again.

//		UIscriptComponent.speedLinesNow();		

//		if (speedingUp == true) {
//		SpeedLinesTextureScript.FadeFlash (0.25, FadeDir.In);
//		yield WaitForSeconds(.25);}
//		else {
//		SpeedLinesTextureScript.FadeFlash (0.5, FadeDir.Out);
//		yield WaitForSeconds(.5);}
}

function speedDown () {
		Slowdown = 0;
		//SpeedLinesTextureScript.LinesFlash (1.0, FadeDir.Out);
		SpeedLinesMeshScript.LinesFlash (1.0, FadeDir.Out);
		yield WaitForSeconds(1.0);
}

function slowDown () {
    if ((Slowdown > 0) && (isSlowing == false)) {
		SmoothSlowdown (); 
	    }
	    else {Slowdown = 0;}
//	the above Slowdown = 0 statement breaks the tweened slowdown, but prevents a nasty bug where newly-loaded levels don't slow properly 
//	    else { Camera.main.SendMessage("speedLinesDown"); }
}

function lerpSlowdown (timer : float) {

    var start = Slowdown;
    var end = 0.0;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        Slowdown = Mathf.Lerp(start, end, i);
        yield;
        
        if (Slowdown > 17999) {break;}
    	}
    yield WaitForSeconds (timer);
    //speedingUp = 1; 
 
}

function lerpPitchUp (timer : float, endPitch : float, endVolume : float) {
    
    var startVol = audioSource.volume;
    var endVol = endVolume;
    
    var start = audioSource.pitch;
    var end = endPitch;
    var i = 0.0;
    var step = 1.0/timer;
 

    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        audioSource.pitch = Mathf.Lerp(start, end, i);
        audioSource.volume = Mathf.SmoothStep(startVol, endVol, i);
        yield;
        
        if (Slowdown < 1) {break;}
    	}
    yield WaitForSeconds (timer);
}

function lerpPitchDown (timer : float, endPitch : float, endVolume : float) {
    
    changingPitch = true;

    var startVol = audioSource.volume;
    var endVol = endVolume;
    
    var start = audioSource.pitch;
    var end = endPitch;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        audioSource.pitch = Mathf.Lerp(start, end, i);
        audioSource.volume = Mathf.SmoothStep(startVol, endVol, i);
        yield;

        if (Slowdown > 17999) {changingPitch = false; break;}        
    	}
    
    yield WaitForSeconds (timer);    
    changingPitch = false;
}

function SpeedLinesOff (timer : float) {
	SpeedLinesTextureScript.FadeOut (timer);
	yield WaitForSeconds(timer);
	SpeedLinesTextureScript.LinesOff();
}

function lerpControl(timer : float) {

    var start = 0.0;
    var end = controlMultiplier;
    var i = 0.0;
    var step = 1.0/timer;
 

    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        controlMultiplier = Mathf.Lerp(start, end, i);
        yield;
		//Debug.Log("My flipmultiplier is " + FallingLaunch.flipMultiplier + " and my end is " + end);
    	}
    yield WaitForSeconds (timer);
}

function Calibrate () {
	FallingLaunch.tiltable = false;
	var acceleratorSnapshot = Input.acceleration;
	FallingLaunch.calibrationRotation = Quaternion.FromToRotation(acceleratorSnapshot, FallingLaunch.restPosition);
	FallingLaunch.tiltable = true;
}