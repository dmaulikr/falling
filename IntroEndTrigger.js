#pragma strict

var Player : GameObject;
var IntroScriptComponent : IntroSequence1stPerson;
//IntroScriptComponent = Player.GetComponent("IntroSequence1stPerson");
var activeIntro : boolean = false;

function Start () {
	IntroScriptComponent = Player.GetComponent("IntroSequence1stPerson");

}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == false){
	activeIntro = true;
	FallingPlayer.ScoreFlashTextureScript.FadeFlash (3, FadeDir.Out);
	IntroScriptComponent.EndIntro(true);
	if (audio) {audio.Play();}
	}
}