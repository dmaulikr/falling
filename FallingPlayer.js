#pragma strict 

// 2 = 255 for rgba in this color array
static var startingFogColor : Color = Color(1.17, 1.17, 1.17, 2);
static var startingFogEndDistance : int = 1500;
static var startingCameraFarClipPlane : int = 1700;
static var startingCloudsAlpha : float = .39f;

//original for corroded sky tubes level
//static var startingFogEndDistance : int = 2500;
//static var startingCameraFarClipPlane : int = 2700;

var changeBackdrop : changeBackdrop;
changeBackdrop = GetComponent("changeBackdrop");
var levelChangeBackdrop : boolean = false;

var ScoreFlashTexture : GameObject;

var ScoreFlashTextureScript : GUITextureLaunch;
ScoreFlashTextureScript = ScoreFlashTexture.GetComponent("GUITextureLaunch");

public var force:float = 1.0;
var dir : Vector3 = Vector3.zero;

enum FadeDir {In, Out}
var fadeTime = 0.5;

var origMat : Material;
//var thisOceanCamera : Component;

// Move object using accelerometer
var speed = 5.0;
var target : Transform;
var smooth = 2.0;
var tiltAngle = 30.0;
//var flipMultiplier : int = 1;
//var flipMultiplier = FallingLaunch.flipMultiplier;

var script : ScoreController;
script = GetComponent("ScoreController");

static var isAlive : int = 0;
isAlive = lifeCountdown.isAlive;

static var isPausable : boolean = true;

var UIscriptName : GameObject;
var UIscriptComponent : fallingUITest;

var whiteFader : FadeInOutAlt;
private var BackdropMist : GameObject;
BackdropMist = transform.FindChild("Cylinder").gameObject;

function Awake() {
//	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	flipMultiplier = -1;
//}
}

function Start() {
//	startingFogColor = RenderSettings.fogColor * 2;
	startingFogEndDistance = RenderSettings.fogEndDistance;
	startingCameraFarClipPlane = transform.FindChild("Camera").camera.farClipPlane;
  	isAlive = 1;
  	UIscriptComponent = UIscriptName.GetComponent(fallingUITest);
	AudioListener.pause = false;
//	fadeInAudio ();
  	FadeAudio (0.1, FadeDir.In);
	isPausable = true;  
	rigidbody.isKinematic = false;
	UIscriptComponent.UnhideGUI();
	introFade();
}

function introFade() {
	// this disables (unchecks) the script FadeInOutAlt after three seconds,
	// so OnGui is only called at the start of each level load.
	yield WaitForSeconds (3);
	whiteFader = Camera.main.GetComponent(FadeInOutAlt);
	whiteFader.enabled = false;
}

function FadeAudio (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : 1.0;
    var end = fadeType == FadeDir.In? 1.0 : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        AudioListener.volume = Mathf.Lerp(start, end, i);
        yield;
    }
}


function DeathRespawn () {
	isPausable = false;
	rigidbody.isKinematic = true;
   	var respawnPosition = Respawn.currentRespawn.transform.position;
	
	UIscriptComponent.fadeOut();
// 	Camera.main.SendMessage("fadeOut");
//  isAlive = 1;

	if (levelChangeBackdrop == true) {
		changeLevelBackdrop ();
	}
	
//	fadeOutAudio ();
  	FadeAudio ((fadeTime/2), FadeDir.Out);
  	      
    gameObject.SendMessage ("ResetScore", 0);
  	yield WaitForSeconds(1);
//	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	collider.attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	transform.position = respawnPosition; // + Vector3.up;
//	Camera.main.SendMessage("fadeIn");

  	FadeAudio (fadeTime, FadeDir.In);
//	thisOceanCamera.SendMessage("fadeIn");
	rigidbody.isKinematic = false;
   	isAlive = 1;
   	UIscriptComponent.fadeIn(true);
}   	

function changeLevelBackdrop () {
  	changeBackdrop.oceanCamera.GetComponent(Camera).enabled = false;
	changeBackdrop.oceanRenderer.enabled = false;
	changeBackdrop.cloudRenderer.enabled = false;
	changeBackdrop.endSphereRenderer.enabled = false;

// the Fade argument below this breaks unpredictably if player gameobject lacks a Fade script component
//	Fade.use.Colors(guiTexture, (RenderSettings.fogColor * 2), startingFogColor, 2.0);	
	RenderSettings.fogEndDistance = startingFogEndDistance;
  	transform.FindChild("Camera").camera.farClipPlane = startingCameraFarClipPlane;
	transform.FindChild("plane-close").renderer.materials = [origMat];
	iTween.ColorTo(BackdropMist,{"a":startingCloudsAlpha,"time":.5});			   	
	}
	   		   	
function Update () {
    var dir : Vector3 = Vector3.zero;
	var tiltAroundZ = (FallingLaunch.flipMultiplier * (-Input.acceleration.y * tiltAngle));
    var tiltAroundX = (FallingLaunch.flipMultiplier * (-Input.acceleration.x * tiltAngle));

    var target = Quaternion.Euler (tiltAroundX, 0, tiltAroundZ);
                // Dampen towards the target rotation
    transform.rotation = Quaternion.Slerp(transform.rotation, target,
                                   Time.deltaTime * smooth);  
	  }
	  
var deadlyObjectName : String = "DeathByFire";
var initialRespawn : Respawn;	// set this to the initial respawn point for the level.

// textfield to hold the score and score variable
private var textfield:GUIText;
private var score:int;

function OnCollisionEnter (collision : Collision) {
// Debug.Log("Hit something!" + collision.contacts[0].normal + dir.x + dir.z + Input.acceleration.x);
// Screen.sleepTimeout = 0.0f;

  if (collision.gameObject.CompareTag ("Death") && (isAlive == 1)) {
  	isAlive = 0;
  	isPausable = false;
  	lifeCountdown.LifeFlashTextureScript.FadeFlash (1, FadeDir.Out);
  	UIscriptComponent.HideGUI();
	yield DeathRespawn ();
	//isPausable = true;
	//UIscriptComponent.UnhideGUI();
  }

}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Score")){

//  Debug.Log("You scored!"); 
//    Camera.main.SendMessage("flashOut");
	ScoreFlashTextureScript.FadeFlash (0.8, FadeDir.Out);

	gameObject.SendMessage ("IncrementScore", 6);
	if (audio) {audio.Play();}
	yield WaitForSeconds(.2);

//	try using PlayClipAtPoint here so score sound fades away in 3D space as you fall?

//  Camera.main.SendMessage("flashUp");	  	
	}
	
  if (other.gameObject.CompareTag ("LevelEnd")) {
	UIscriptComponent.LevelComplete();
// to keep you from dying after you strike the levelend trigger
	gameObject.SendMessage ("IncrementScore", 20);
  }	
}
			
@script AddComponentMenu("Scripts/FallingPlayer")