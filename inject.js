(function() {

    let uniqIdPrefix = "github-helper-";

    // copy from /pull/xxxx/files page
    let fileIcon = '<svg class="octicon octicon-file-diff d-none d-md-inline-block" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177l-2.914-2.914a.25.25 0 00-.177-.073H2.75zM1 1.75C1 .784 1.784 0 2.75 0h7.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V1.75zm7 1.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0V7h-1.5a.75.75 0 010-1.5h1.5V4A.75.75 0 018 3.25zm-3 8a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"></path></svg>';
    let commentIcon = '<svg class="github-pr-file-comment octicon octicon-comment text-gray" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z"></path></svg>';


    let repoIndexPage = function() {
        addFilesLinkIcon();
    }

    let pullListPage = function() {
        addFilesLinkIcon();
        addClubhouseLinkForPullList();
        addMyLinks();
    }

    let addMyLinks = function() {
        let filterDiv = document.getElementsByClassName('table-list-filters')[0];
        let filterLinkDiv = filterDiv.getElementsByClassName('table-list-header-toggle')[0];

        let myPRLinkId = uniqIdPrefix + "my-pr";

        if(document.getElementById(myPRLinkId)){
            return
        }

        let href = window.location.href;
        let match = href.match(/github.com(\/[a-z/_]+\/pulls)/i);
        if(match){
            let baseLink = match[1];
            let myPRLink = document.createElement('a');
            myPRLink.href = baseLink + '/@me';
            myPRLink.className = 'btn-link';
            myPRLink.text = "@me";
            myPRLink.id = myPRLinkId;

            filterLinkDiv.append(myPRLink);
        }
    }

    let getClubhouseLink = function(uid, text) {
        let match = text.match(/^(.*?)(\[?ch([0-9]+)\]?)(.*?)$/im);
        if(match) {
            let leftText = match[1];
            let rightText = match[4];

            let chText = match[2];
            let chId = match[3];

            let leftNode = document.createTextNode(leftText);
            let rightNode = document.createTextNode(rightText);

            let link = document.createElement('a');
            link.href = 'https://app.clubhouse.io/story/' + chId;
            link.style = "color: rgb(99, 33, 220)";
            link.className = uid;
            link.text = chText;
            link.target = '_blank';
            return [leftNode, link, rightNode]
        }
        return;
    }

    let addClubhouseLinkForPullList = function() {
        let listContainer = document.getElementsByClassName('repository-content')[0];
        let els = listContainer.getElementsByTagName('a');
        for (let i=0; i<els.length; i++) {
            let el = els[i];
            if(el.getAttribute('data-hovercard-type') != 'pull_request') {
                continue;
            }
            let uid = uniqIdPrefix + "clubhouse";
            if(el.getElementsByClassName(uid).length>0) {
                continue;
            }

            let ret = getClubhouseLink(uid, el.text);
            if(ret) {
                let text = el.firstChild;
                for(let i=0; i<ret.length; i++) {
                    el.insertBefore(ret[i], text);
                }
                text.remove();
            }
        }
    }

    let insertAfter = function(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    let addFilesLinkIcon = function() {
        let filesIconClassName = uniqIdPrefix + "files";
        if (document.getElementsByClassName(filesIconClassName).length > 0) {
            return
        }

        let listContainer = document.getElementsByClassName('repository-content')[0];
        let els = listContainer.getElementsByTagName('a');
        for (let i=0; i<els.length; i++) {
            let el = els[i];
            if(el.getAttribute('data-hovercard-type') != 'pull_request') {
                continue;
            }

            let span = document.createElement('span');
            span.classList = 'd-inline-block mr-1';
            let filesListLink = document.createElement('a');
            filesListLink.className = filesIconClassName;
            filesListLink.innerHTML = fileIcon;
            filesListLink.href = el.href + '/files';
            filesListLink.style = "margin-left:5px;";
            span.append(filesListLink);
            insertAfter(el, span);
        }
    }

    let pullRequestDetailPage = function() {
        addClubhouseLinkForComments();
    }

    let matchClubhose = function(parent, callback) {
        let node = parent.firstChild;
        if(node == null) {
            return
        }
    }

    let addClubhouseLinkForComments = function(){
        let comments = document.getElementsByClassName('comment-body')
        for (let i=0; i<comments.length; i++) {
            let comment = comments[i];
            if(comment.nodeName != 'TD') {
                continue;
            }

            let uid = uniqIdPrefix + "clubhouse";
            if(comment.getElementsByClassName(uid).length > 0) {
                continue;
            }

            let els = comment.getElementsByTagName("*");
            let length = els.length;
            for(let j=0; j<length; j++) {
                let el = els[j];
                let nodes = el.childNodes;
                for (var k=0; k<nodes.length; k++) {
                    let node = nodes[k];
                    if(node && node.nodeType == 3) {
                        let ret = getClubhouseLink(uid, node.data);
                        if(ret) {
                            for(let i=0; i<ret.length; i++) {
                                el.insertBefore(ret[i], node);
                            }
                            node.remove();
                        }
                    }
                }
            }
        }
    }

    let pullRequestDetailPageFilesList = function() {
        addCommentIcon();
        addToggleButton("comments");
        addToggleButton("annotations");
    }

    let addCommentIcon = function() {
        let checkboxs = document.getElementsByClassName('js-toggle-file-notes');
        for (let i=0; i<checkboxs.length; i++) {
            let checkbox = checkboxs[i];

            checkbox.onclick = function(event) {
                let me = event.target;
                let parent = findParentNodeByAttr(me, 'data-details-container-group', 'file');
                if(parent) {
                    let appendIconClassName = uniqIdPrefix + "comments-icon";
                    let comments = parent.getElementsByClassName('inline-comments');
                    for(let i=0; i<comments.length; i++) {
                        let commentsTr = comments[i];

                        if(!commentsTr) {
                            return;
                        }

                        let nextTr = commentsTr.previousElementSibling;
                        let els = nextTr.getElementsByClassName(appendIconClassName);
                        if(me.checked) {
                            // need to remove icon
                            for(let i=0; i<els.length; i++){
                                els[i].remove();
                            }
                        } else {
                            // need to add icon
                            if(els.length > 0){
                                return;
                            }

                            const span = document.createElement('span');
                            span.className = appendIconClassName;
                            span.innerHTML = commentIcon;
                            nextTr.getElementsByTagName('td')[0].append(span);
                        }
                    }
                }
            }
        }
    }

    let findParentNodeByAttr = function(el, attributeName, attributeValue) {
        let tmpEl = el.parentNode;
        while(tmpEl) {
            if (tmpEl.nodeName == 'BODY') {
                return 
            }
            if(tmpEl.getAttribute(attributeName) == attributeValue) {
                return tmpEl;
            } else {
                tmpEl = tmpEl.parentNode;
            }
        }
        return;
    }


    let addToggleButton = function(toggleType) {
        let diffbar = document.getElementsByClassName('diffbar');
        let toggleButtonId = uniqIdPrefix + "-" + toggleType + "-toggle-button";
        if (!diffbar.length > 0 || document.getElementById(toggleButtonId)) {
            return
        }

        keyClassNames = {
            "comments": "js-toggle-file-notes",
            "annotations": "js-toggle-file-check-annotations",
        }

        let toolsDiv = diffbar[0].children[1];
        let toggleButton = document.createElement('a');
        toggleButton.innerText = toggleType + "(hide)";
        toggleButton.data = "show";
        toggleButton.style = "cursor: pointer";
        toggleButton.id = toggleButtonId;
        toggleButton.onclick = function() {
            let checkboxs = document.getElementsByClassName(keyClassNames[toggleType]);

            for (let i=0; i<checkboxs.length; i++) {
                let checkbox = checkboxs[i];

                if(checkbox.checked && toggleButton.data == "show") {
                    checkbox.click();
                } else if(!checkbox.checked && toggleButton.data == "hide") {
                    checkbox.click();
                }
            }
            if (toggleButton.data == "show") {
                toggleButton.data = "hide";
                toggleButton.innerText = toggleType + "(show)";
            } else {
                toggleButton.data = "show";
                toggleButton.innerText = toggleType + "(hide)";
            }
        }
        toggleButton.className = 'diffbar-item';
        toolsDiv.append(toggleButton);
    }

    let runInject = function() {
        let href = window.location.href;
        
        if (href.match(/github.com\/[a-z/_]+\/pulls/i)) {
            pullListPage()
        } else if (href.match(/github.com\/[a-z/_]+\/pull\/(\d+)\/files/i)) {
            pullRequestDetailPageFilesList()
        } else if (href.match(/github.com\/[a-z/_]+\/pull\/(\d+)$/i)) {
            pullRequestDetailPage()
        } else if (href.match(/github.com\/[a-z_]+\/[a-z_]+$/i)) {
            repoIndexPage()
        }
    }

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === 'URL_CHANGE') {
                runInject();
            }
        }
    )
})()
