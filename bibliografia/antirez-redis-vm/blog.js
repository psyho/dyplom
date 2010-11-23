function areyousure(message) {
    return confirm(message + ": sei sicuro?");
}

function feedbacks() {
    var f = document.getElementById('fb');
    f.fbrealvalue.value = f.fbvalue.value;
    return true;
}
