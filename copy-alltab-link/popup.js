
const AMAZON_HOST = "www.amazon.co.jp";

const copyText = text => {
  let copyTextArea = document.querySelector("#copy-textarea");
  copyTextArea.textContent = text;
  copyTextArea.select();
  document.execCommand('copy');
}

const extractAmazonUrl = rawUrl => {
  const url = new URL(rawUrl);
  if (url.host == AMAZON_HOST && url.pathname.match(/\/dp\/[A-Za-z0-9]+\//)) {
    newUrl = url.origin + url.pathname.replace(/(^\S+)(\/dp\/[A-Za-z0-9]+\/)(.*)/, '$2');
    return newUrl;
  } else {
    return rawUrl;
  }
}

const copyUrl = menuType => {

  var texts = new Array();

  chrome.tabs.query({currentWindow: true}, function (tabs) {
    tabs.forEach(function(element){

        let url = element.url;
        const title = element.title;

        // Process AmazonURL
        url = extractAmazonUrl(url);

        let text;
        switch (menuType) {
          case "markdown":
            text = `[${title}](${url})`
            break;
          case "org-mode":
            text = `[[${url}][${title}]]`
            break;
        }
        texts.push(text);
    });

    let printText = "";
    texts.forEach(function(element){
        printText += " - " + element + "\n";
    });
    copyText(printText);

  })
}

const onInit = _ => {
  document.querySelectorAll(".bettercopy-menu").forEach(el => {
    el.addEventListener("click", onClickCopyMenu);
  });
}

const onClickCopyMenu = function(evt){
  const menuType = this.id;
  copyUrl(menuType);
}

document.addEventListener("DOMContentLoaded", onInit);
