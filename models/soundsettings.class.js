function setSound(){
    if (localStorage.sounds){
        if (localStorage.sounds === "on") {
            document.getElementById("sound-btn").src = "img/icons/volume_up.svg";
        } else if (localStorage.sounds === "off") {
            document.getElementById("sound-btn").src = "img/icons/volume_off.svg";
        }
    }
}