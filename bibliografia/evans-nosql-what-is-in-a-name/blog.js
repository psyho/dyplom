
function confirm_delete(loc)
{
    var answer = confirm('Permanently delete this article?');
    if (answer == true) {
        self.location = loc
    }
    return false
}
