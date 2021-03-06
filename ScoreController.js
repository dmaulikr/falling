#pragma strict

// Keep track of the player's main score
static var currentScore : float = 20f;
static var maxScore = 25f;

// Keep track of the currently visible score
static var visibleScore : float = 20f;

function Start() {
	ResetScore (25);
}

function LerpVisibleScore (start : float, end : float, timer : float) {

    var i = 0.0;
    var step = 1.0/timer;

    while (i < 1.0) {
        i += step * Time.deltaTime;
        visibleScore = Mathf.Lerp(start, end, i);
        yield;
    }
}

function IncrementScore ( i : float ) {
	currentScore = (currentScore + i);
    if (currentScore > maxScore) {currentScore = maxScore;}
}

function DecrementScore ( i : float ) {
    currentScore -= i;
//	LerpVisibleScore(visibleScore, currentScore, i);
}

function ZeroScore ( i : float ) {
    currentScore = 0;
//	AnimateVisibleScore ();
}

function ScoreUpdate ( timer : float) {
	LerpVisibleScore(visibleScore, currentScore, timer);
//	Debug.Log("Your visibleScore is: " + visibleScore + " and your currentScore is: " + currentScore);
}

function ResetScore ( i : float ) {currentScore = maxScore;}