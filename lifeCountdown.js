var script : ScoreController;
script = GetComponent("ScoreController");

var LifeFlashTexture : GameObject;
static var LifeFlashTextureScript : GUITextureLaunch;
LifeFlashTextureScript = LifeFlashTexture.GetComponent("GUITextureLaunch");
static var inOutro : boolean = false;

static var isAlive : int = 0;
var UIscriptName : GameObject;

function Start () {
	   	isAlive = 1;
	   	Loop ();
	   	Loop2 ();
	   	ScoreLerpLoop ();
}
	   	
function Loop () {
    while (true) {
        yield TickingAway(.25);
//        Debug.Log("Your visible score is + " + script.visibleScore);
//        Debug.Log("Your current score is + " + script.currentScore);
    }
}

function Loop2 () {
    while (true) {
		yield LifeFlashCheck(.2, 5);
    }
}

function ScoreLerpLoop () {
    while (true) {
		script.ScoreUpdate(.25);
		yield WaitForSeconds(.25);
	}
}
	   
	   	
function TickingAway (delay : float) {
	if (inOutro == false) {
		if (controllerITween2.Slowdown > 17999) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds((delay/4));
		}
		
		else if ((script.currentScore > 0) && (controllerITween2.Slowdown < 18000)) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds(delay);
	   	}
	   	
	   	else {
		   	isAlive = 0;
		   	FallingPlayer.isPausable = false;
		   	LifeFlashTextureScript.FadeFlash (1, FadeDir.Out);
		   	
		   	//UIscriptName.GetComponent(fallingUITest).HideGUI();
		   	yield GetComponent(FallingPlayer).DeathRespawn ();
			//UIscriptName.GetComponent(fallingUITest).UnhideGUI();
		}
	}
}


function LifeFlashCheck (delay : float, score : int) {

	if (script.currentScore < score && inOutro == false) {
	    //Camera.main.SendMessage("lifeFlashOut");
		LifeFlashTextureScript.FadeFlash (delay, FadeDir.In);
		yield WaitForSeconds(delay);
//		Camera.main.SendMessage("lifeFlashUp");
		LifeFlashTextureScript.FadeFlash (delay, FadeDir.Out);
		yield WaitForSeconds((delay*3));		
	}
}

// not being used currently, due to more versatile LifeFlashCheck in a separate coroutine.
function LifeFlash (delay : float, score : int) {

	if (script.currentScore < score) {
	    Camera.main.SendMessage("lifeFlashOut");
		yield WaitForSeconds(delay);
		Camera.main.SendMessage("lifeFlashUp");
	}
}
