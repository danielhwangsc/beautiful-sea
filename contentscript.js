put_commit_message = function() {
    if ($("#pull_request_body").is(":visible")) {
        var str = "Commits:\n";
        var commits = $('.commit');
        for (var i = 0; i < commits.length; i++) {
            var commit_id = commits.eq(i).find('.commit-id').html();
            var commit_message = commits.eq(i).find('.commit-message .message').attr('title');
            console.log(commit_id, commit_message);
            str += commit_id + " : " + commit_message.replace(/(\r\n|\n|\r|\t)/gm," ").replace(/\s+/g," ") + "\n";
        }

        str += "\nDescription:\n\n\n";
        str += "Reviewers:\n";

        $("#pull_request_body").val(str);
        return ['done'];
    } else if ($("#new_comment_field").is(":visible")) {
        var res = [];
        var commits = $('.commit');
        for (var i = 0; i < commits.length; i++) {
            var id = commits.eq(i).find('.commit-id').html();
            if (id && id.trim().length > 0) {
                res.push(id.trim());
            }
        }
        return res;
    }
    return null;
};

put_commit_comment = function(target_commit) {
    if ($("#new_comment_field").is(":visible")) {
        var str = "Commits:\n";
        var commits = $('.commit');
        var found_target = false;
        for (var i = 0; i < commits.length; i++) {
            var commit_id = commits.eq(i).find('.commit-id').html();
            if (commit_id && commit_id.trim().length > 0 && (found_target || commit_id.trim() == target_commit)) {
                found_target = true;
                var commit_message = commits.eq(i).find('.commit-message .message').attr('title');
                console.log(commit_id, commit_message);
                str += commit_id + " : " + commit_message.replace(/(\r\n|\n|\r|\t)/gm," ").replace(/\s+/g," ") + "\n";
            }
        }

        str += "\nDescription:\n\n\n";
        str += "Reviewers:\n";

        $("#new_comment_field").val(str);
        return ["done"]
    }
    return null;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "go") {
            var res = put_commit_message();
            if (res) {
                if (res.length > 0 && res[0] != 'done') {
                    sendResponse({ids: res.join(','), status: "partial"});
                } else {
                    sendResponse({status: "done"});
                }
            } else {
                sendResponse({status: "none"});
            }
        } else if (request.action == "go2") {
            console.log(request);
            var res = put_commit_comment(request.commit_id);
            if (res && res.length > 0 && res[0] == "done") {
                sendResponse({status: "done"})
            } else {
                sendResponse({status: "none"});
            }
            sendResponse({status: "done"});
        }
    }
);