#pragma strict

var player : GameObject;
var fallingPlayerComponent : FallingPlayer;

var value : float = 0.5f;
var bgSprite : UISprite;
static var tutorialSprite : UISprite;
static var tutorialSpriteExtraTimer : float = 0; 
var fadeSprite : UISprite;
var pauseButton : UIButton;
var circleReticle: UIButton;
var lifeBarOutline : UIProgressBar;
var lifeBar : UIProgressBar;
var lifeBarThreat : UIProgressBar;
var rightArrow : UIButton;
var leftArrow : UIButton;
var loadNewLevelButton : UIButton;
var loadLevelOne : UIButton;
var loadLevelTwo : UIButton;
var loadLevelThree : UIButton;
var loadLevelFour : UIButton;
var openSiteButton : UIButton;
static var loadingLabel : UIButton;
var BackToPauseMenuButton : UIButton;

static var spriteEdgeSize : int;
var buttonScaleFactor : float;
var initialRespawn : Respawn;

var levelToLoad : String = "";

var level1 : String = "Falling-scene-tutorial";
var level2 : String = "Falling-scene2";
var level3 : String = "Falling-scene1-scale";
var level4 : String = "Falling-scene3";

private var savedTimeScale:float;
//var x:float;
//var y:float;
// private var lifeBar = UIProgressBar.create( "lifeBarRedTest.png", 0, 0 );

function Start () {
//  yield WaitForSeconds(0.5f);

//	  Testing to see if disabling this hard coded screen.orientation will allow auto detection of landscape 
//	  right or left mode on startup.
//    Screen.orientation = ScreenOrientation.LandscapeLeft;

//    if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	Screen.orientation = ScreenOrientation.LandscapeRight;}
//	else {Screen.orientation = ScreenOrientation.LandscapeLeft;}
	
	fallingPlayerComponent = player.GetComponent("FallingPlayer");

    bgSprite = UI.firstToolkit.addSprite( "menuBackground.png", 0, 0, 2 );
	bgSprite.positionCenter();
	bgSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Linear.easeIn);
	bgSprite.alphaTo( 0.01f, 0.9f, Easing.Sinusoidal.easeOut);
	bgSprite.hidden = true;

	if (UI.isHD == true) {
		spriteEdgeSize = 4;
		buttonScaleFactor = (((Screen.height / 2.0) - 100.0) / Screen.height);
	}
	else {
		spriteEdgeSize = 2;
		buttonScaleFactor = (((Screen.height / 2.0) - 50.0) / Screen.height);
	}
	
//	var tutorialHeight = 1.25 * spriteEdgeSize;
	tutorialSprite = UI.firstToolkit.addSprite( "tutorialBackground.png", 0, 0, 4 );
	tutorialSprite.hidden = true;
	tutorialSprite.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	
	fadeSprite = UI.firstToolkit.addSprite( "menuBackgroundBlack.png", 0, 0, -1 );
	fadeSprite.positionCenter();
	fadeSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Linear.easeIn);
	fadeSprite.alphaTo( 0.01f, 0.0f, Easing.Sinusoidal.easeOut);
	fadeSprite.hidden = true;

	pauseButton = UIButton.create("pauseWhite.png","pauseGray.png", 0, 0);
	pauseButton.pixelsFromTopRight( 5, 5 );
	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(30);
	pauseButton.onTouchUpInside += PauseGameCheck;

	rightArrow = UIButton.create("rightArrow.png","rightArrowDown.png", 0, 0);
	rightArrow.positionFromTopRight(buttonScaleFactor,0.2f);
	rightArrow.onTouchUpInside += PauseGameCheck;
	
	leftArrow = UIButton.create("restart.png","restartDown.png", 0, 0);
	leftArrow.positionFromTopLeft(buttonScaleFactor,0.2f);
	leftArrow.onTouchUpInside += RestartLevel;

	rightArrow.hidden = true;
	leftArrow.hidden = true;
	
	BackToPauseMenuButton = UIButton.create("back.png","back.png", 40, 40);
	BackToPauseMenuButton.positionFromBottomLeft(.05f, .05f);
	BackToPauseMenuButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	BackToPauseMenuButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );

	if (level1 == Application.loadedLevelName) {
	loadLevelOne = UIButton.create("level1.png","level1.png", 0, 0);
	loadLevelOne.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);}
	else {				
	loadLevelOne = UIButton.create("level1.png","level1.png", 0, 0);}
	loadLevelOne.positionFromTopLeft(buttonScaleFactor,0.05f);
	loadLevelOne.onTouchUpInside += LoadLevel1ViaMenu;
	
	if (level2 == Application.loadedLevelName) {
	loadLevelTwo = UIButton.create("level2.png","level2.png", 0, 0);
	loadLevelTwo.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);}
	else {				
	loadLevelTwo = UIButton.create("level2.png","level2.png", 0, 0);}
	loadLevelTwo.positionFromTopLeft(buttonScaleFactor,0.3f);
	loadLevelTwo.onTouchUpInside += LoadLevel2ViaMenu;
	
	if (level3 == Application.loadedLevelName) {
	loadLevelThree = UIButton.create("level3.png","level3.png", 0, 0);
	loadLevelThree.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);}
	else {				
	loadLevelThree = UIButton.create("level3.png","level3.png", 0, 0);}
	loadLevelThree.positionFromTopRight(buttonScaleFactor,0.3f);
	loadLevelThree.onTouchUpInside += LoadLevel3ViaMenu;
	
	if (level4 == Application.loadedLevelName) {
	loadLevelFour = UIButton.create("level4.png","level4.png", 0, 0);
	loadLevelFour.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);}
	else {				
	loadLevelFour = UIButton.create("level4.png","level4.png", 0, 0);}
	loadLevelFour.positionFromTopRight(buttonScaleFactor,0.05f);
	loadLevelFour.onTouchUpInside += LoadLevel4ViaMenu;		
	
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
		
	BackToPauseMenuButton.onTouchUpInside += BackToPauseMenu;	
	BackToPauseMenuButton.hidden = true;
	
	loadingLabel = UIButton.create("loading.png","loading.png", 20, 20);
	loadingLabel.positionCenter();
	loadingLabel.hidden = true;
	
	loadNewLevelButton = UIButton.create("newlevel.png","newlevel.png", 40, 40);
	loadNewLevelButton.positionFromBottomLeft(.05f, .05f);
	loadNewLevelButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.onTouchUpInside += LevelSelect;
	loadNewLevelButton.hidden = true;
	
	openSiteButton = UIButton.create("website.png","website.png", 40, 40);
	openSiteButton.positionFromBottomRight(.05f, .05f);	
	openSiteButton.onTouchUpInside += OpenSite;
	openSiteButton.hidden = true;
	
	circleReticle = UIButton.create("circle-reticle.png","circle-reticle.png", 0, 0);
	circleReticle.positionCenter();
	
	lifeBarOutline = UIProgressBar.create( "lifeBarOutline.png", 0, 0 );
	lifeBarOutline.pixelsFromTopLeft ( 8, 8 );
	lifeBarOutline.value = 1f;
	lifeBarOutline.resizeTextureOnChange = false;

	lifeBarThreat = UIProgressBar.create( "lifeBarRed.png", 0, 0 );
	lifeBarThreat.rightToLeft = true;
	lifeBarThreat.pixelsFromTopLeft ( 10, 246 );
	lifeBarThreat.value = 1f;
//	lifeBarThreat.resizeTextureOnChange = true;
//	animateThreatBar (lifeBarThreat);
	lifeBarThreat.hidden = true;
	lifeBarThreat.alphaFromTo( 0.01f, 0f, 0f, Easing.Sinusoidal.easeOut);
					
	lifeBar = UIProgressBar.create( "lifeBarWhite.png", 0, 0 );
	lifeBar.pixelsFromTopLeft ( 10, 10 );
	lifeBar.resizeTextureOnChange = true;
	lifeBar.value = 0.67f;	
	animateProgressBar (lifeBar);
//	Loop ();

	}

function animateProgressBar(lifeBar : UIProgressBar) {
	while (true)
	{
	lifeBar.value = (parseFloat(ScoreController.visibleScore)/parseFloat(ScoreController.maxScore));
//	Debug.Log(lifeBar.value + " is lifebar value");
//	Debug.Log(ScoreController.currentScore + " is currentScore");
//	yield WaitForSeconds (1);
	yield 0;
	}
}

function animateThreatBar(lifeBar : UIProgressBar) {
	while (true)
	{
	lifeBar.value = (1 - (parseFloat(ScoreController.visibleScore)/parseFloat(ScoreController.maxScore)));
	yield 0;
	}
}

function flashProgressBar(delay : float) {
	lifeBar.alphaTo( 0.01f, 1.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds(.25);
	lifeBar.alphaTo( delay, 0.5f, Easing.Sinusoidal.easeInOut);
}

function showThreatBar(delay : float) {
	lifeBarThreat.alphaTo( delay, 0.25f, Easing.Sinusoidal.easeInOut);
}

function hideThreatBar(delay : float) {
	lifeBarThreat.alphaTo( delay, 0.0f, Easing.Sinusoidal.easeInOut);
}

function flashThreatBar(delay : float) {
	lifeBarThreat.hidden = false;
	lifeBarThreat.alphaFromTo( delay, 1.0f, 0.0f, Easing.Sinusoidal.easeInOut);
	yield WaitForSeconds(delay);
//	lifeBarThreat.hidden = true;
}

function PauseGame() {
	if (FallingPlayer.isPausable == true) {
		FallingPlayer.isPausable = false;
		
		circleReticle.hidden = true;
		lifeBar.hidden = true;
		lifeBarOutline.hidden = true;
	    lifeBarThreat.hidden = true;
	    
	    savedTimeScale = Time.timeScale;
		fallingPlayerComponent.FadeAudio (.09, FadeDir.Out);
	    yield WaitForSeconds (.1);
	    Time.timeScale = 0;
	    AudioListener.pause = true;

   		rightArrow.hidden = false;
		leftArrow.hidden = false;
		loadNewLevelButton.hidden = false;
		bgSprite.hidden = false;
		//openSiteButton.hidden = false;

	    FallingPlayer.isPausable = true;
    }
}

function UnPauseGame(resume : boolean) {
	FallingPlayer.isPausable = false;
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
	fallingPlayerComponent.FadeAudio (1.0, FadeDir.In);
	circleReticle.hidden = false;
	lifeBar.hidden = false;
	lifeBarOutline.hidden = false;
	lifeBarThreat.hidden = false;
	
	bgSprite.hidden = true;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	loadNewLevelButton.hidden = true;
	openSiteButton.hidden = true;
	FallingPlayer.isPausable = resume;	
    }
    
function IsGamePaused() {
    return Time.timeScale==0;
}

function PauseGameCheck() {
	if (FallingPlayer.isPausable == true) {
		if (Time.timeScale == 0) {
	//	if (AudioListener.pause == true) {
			UnPauseGame(true);
		}
		else {
			PauseGame();
		}
	}
}

function RestartLevel() {
	FallingPlayer.isPausable = false;	
//	Camera.main.SendMessage("fadeOut");
	//fadeOut();
	Respawn.currentRespawn = initialRespawn;
	HideGUI();
	fallingPlayerComponent.DeathRespawn ();
	UnPauseGame(false);
}

function LevelComplete() {
	HideGUI();
	FallingPlayer.isPausable = false;
	MoveController.Slowdown = 0;
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 1.5f, 0.0f, 0.95f, Easing.Sinusoidal.easeIn);
	fallingPlayerComponent.FadeAudio (.8, FadeDir.Out);
	yield WaitForSeconds (.5);
// fade in congrats menu / buttons here 

	FallingLaunch.levelEndSlowdown = MoveController.Slowdown;
    savedTimeScale = Time.timeScale;
	loadingLabel.hidden = false;
	loadingLabel.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);    
    yield WaitForSeconds (1);
//    Time.timeScale = 0;
	player.rigidbody.isKinematic = true;
    AudioListener.pause = true;
	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
}

function BeginOutroUI() {
	FadeOutGUI();
	FallingPlayer.isPausable = false;
	player.rigidbody.isKinematic = true;
}

function OldGameCompleteUI() {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 4.5f, 0.0f, 0.90f, Easing.Sinusoidal.easeInOut);
	fallingPlayerComponent.FadeAudio (2.0, FadeDir.Out);
	yield WaitForSeconds (1.0);
	yield WaitForSeconds (2.0);
}

function GameComplete() {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 1.5f, 0.0f, 0.90f, Easing.Sinusoidal.easeIn);
	fallingPlayerComponent.FadeAudio (1.5, FadeDir.Out);
	yield WaitForSeconds (.5);
    savedTimeScale = Time.timeScale;
//	loadingLabel.hidden = false;
//	loadingLabel.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);    
    yield WaitForSeconds (1);
    AudioListener.pause = true;
	FallingPlayer.isTiltable = true;
	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
}

function GameCompleteUI() {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 2f, 0.0f, 0.8f, Easing.Sinusoidal.easeIn);
	fallingPlayerComponent.FadeAudio (1.5, FadeDir.Out);
	
	// add anything else that requires main uitoolkit instance
}

function OutroDiamondFlash( timer : float ) {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( timer, 1.0f, 0.2f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (timer);
	bgSprite.alphaTo( 1.0f, 0.0f, Easing.Sinusoidal.easeIn);
}

function LoadNewLevelViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	FallingLaunch.levelEndSlowdown = 0;
	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
}

function LevelSelect() {
	leftArrow.hidden = true;
	rightArrow.hidden = true;
	pauseButton.hidden = true;
	
	loadLevelOne.hidden = false;
	loadLevelTwo.hidden = false;
	loadLevelThree.hidden = false;
	loadLevelFour.hidden = false;
	
	loadNewLevelButton.hidden = true;	
	BackToPauseMenuButton.hidden = false;
}

function BackToPauseMenu() {
	leftArrow.hidden = false;
	rightArrow.hidden = false;
	pauseButton.hidden = false;
	
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	
	loadNewLevelButton.hidden = false;
	BackToPauseMenuButton.hidden = true;
}

function LoadLevel1ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level1);
	Time.timeScale = savedTimeScale;
}

function LoadLevel2ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;	
	
	Application.LoadLevel(level2);
	Time.timeScale = savedTimeScale;
}

function LoadLevel3ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level3);
	Time.timeScale = savedTimeScale;
}

function LoadLevel4ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level4);
	Time.timeScale = savedTimeScale;
}

function OpenSite() {
	Application.OpenURL ("http://tysonkubota.net/");
}

function HideGUI() {
		pauseButton.hidden = true;
		circleReticle.hidden = true;
		lifeBar.hidden = true;
		lifeBarOutline.hidden = true;
		lifeBarThreat.hidden = true;
}

function FadeOutGUI() {
	pauseButton.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	lifeBar.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	lifeBarOutline.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	circleReticle.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	lifeBarThreat.hidden = true;
	yield WaitForSeconds (1.0);
	
	pauseButton.hidden = true;
	circleReticle.hidden = true;
	lifeBar.hidden = true;
	lifeBarOutline.hidden = true;
}


function UnhideGUI() {
		pauseButton.hidden = false;
		circleReticle.hidden = false;
		lifeBar.hidden = false;
		lifeBarOutline.hidden = false;
		lifeBarThreat.hidden = false;
		
//		lifeBarThreat.alphaFrom( 1.0f, 0.0f, Easing.Quartic.easeIn);
		pauseButton.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		lifeBar.alphaFromTo( 1.0f, 0.0f, 0.5f, Easing.Quartic.easeIn);
		lifeBarOutline.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		circleReticle.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		yield WaitForSeconds (1.0);
		FallingPlayer.isPausable = true;
}

function fadeIn( shouldUnhideGUI : boolean ) {
		fadeSprite.hidden = false;
		fadeSprite.alphaTo( 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
		yield WaitForSeconds(.5);
		if (shouldUnhideGUI == true) {UnhideGUI();}
		yield WaitForSeconds(.5);
		fadeSprite.hidden = true;
}

function fadeOut() {
		fadeSprite.hidden = false;
		fadeSprite.alphaTo( 1.0f, 1.0f, Easing.Sinusoidal.easeOut);
		yield WaitForSeconds(1);
		fadeSprite.hidden = true;
}


function OnApplicationPause(pauseStatus: boolean) {
    if (pauseStatus && Time.timeScale != 0 && FallingPlayer.isPausable == true) {setSavedTimeScale(); PauseGameNow();}
}

function setSavedTimeScale() {
	savedTimeScale = Time.timeScale;
}
	
function PauseGameNow() {		
	circleReticle.hidden = true;
	lifeBar.hidden = true;
	lifeBarOutline.hidden = true;
    
//	savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.volume = 0;
    AudioListener.pause = true;

	rightArrow.hidden = false;
	leftArrow.hidden = false;
	loadNewLevelButton.hidden = false;
	bgSprite.hidden = false;
}

function PauseGameBackgroundCheck() {
	if (FallingPlayer.isPausable == true) {
		if (Time.timeScale == 0) {
			UnPauseGame(true);
		}
		else {
			PauseGameNow();
		}
	}
}

function tutorialSpritePosition(timer : float) {
	tutorialSprite.centerize();
	tutorialSprite.pixelsFromBottom (- spriteEdgeSize * 3);
	tutorialSprite.hidden = false;
	tutorialSprite.alphaFromTo( 1.0f, 0f, 0.85f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (timer);
	yield WaitForSeconds (tutorialSpriteExtraTimer);
	tutorialSpriteExtraTimer = 0;
	tutorialSprite.alphaTo( 2.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (2);
	tutorialSprite.hidden = true;
}
