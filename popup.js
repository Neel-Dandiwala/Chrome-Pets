document.getElementById("enable").addEventListener("click", () => {
    chrome.storage.sync.get('isEnabled', storage => {
        chrome.storage.sync.set({
            isEnabled: !storage.isEnabled,
        });
        console.log('clcick')
    });
})

// chrome.storage.sync.get('isEnabled', storage => {
//         chrome.storage.sync.set({
//             isEnabled: false,
//         });
// });


chrome.storage.sync.get('buttonDisabled', storage => {
    chrome.storage.sync.set({
        buttonDisabled: false,
    });
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.buttonDisabled) document.getElementById("enable").disabled = changes.buttonDisabled.newValue;
  });