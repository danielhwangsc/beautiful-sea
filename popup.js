// Javascript for Beautiful Sea Chrome Extension

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {action: "go"}, function(response) {
    if (response.status == 'done') {
      window.close();
    } else if (response.status == 'none') {
      window.close();
    } else if (response.status == 'partial') {

      var ids = response.ids.split(',');
      $('body').html("Choose starting commit:<br/>");
      $('body').append("<ul></ul>");
      for (var i = 0; i < ids.length; i++) {
        $('ul').append("<a href=\"#\" class=\"commit-id\"'>" + ids[i] + "</a><br/>");
      }

      $('.commit-id').click(function(e) {
          e.preventDefault();
          chrome.tabs.sendMessage(tabs[0].id, {action: "go2", commit_id: $(this).html()}, function(response) {
            if (response.status == 'done') {
              window.close();
            }
          });
      });

    }
  });
});