#pragma strict

var scriptName : GameObject;
static var currentIcon : UISprite;

function Start () {
	}

function ShowIcon(icon : UISprite, timer : float, bgIcon : UISprite) {
//	tutorialSpritePosition(timer);
	
	if (currentIcon) {
		currentIcon.hidden = true;
		bgIcon.hidden = true;
	}
	currentIcon = icon;		
	icon.hidden = false;
	bgIcon.hidden = false;
	icon.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds (timer);
	icon.alphaTo( 2.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (2);
	icon.hidden = true;
}
