function setSound(){
    if (localStorage.sounds){
        if (localStorage.sounds === "on") {
            document.getElementById("sound-btn").src = "assets/img/icons/volume_up.png";
        } else if (localStorage.sounds === "off") {
            document.getElementById("sound-btn").src = "assets/img/icons/mute.png";
        }
    }
}