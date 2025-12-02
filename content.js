const state = {
    listOfFansToBlock: []
}

chrome.storage.sync.get("listOfFansToBlock", (result) => {
    const listOfFanNames = result.listOfFansToBlock || [];
    listOfFanNames.forEach(fanName => removeFanByName(fanName));
})

function removeFanByName(fanName) {
    const fanDiv = document.getElementsByClassName('no-writing')[0]

    const fans = fanDiv.getElementsByClassName('fan pic')

    for (let fan of fans) {
        if (fan.getAttribute('href').toLocaleLowerCase().includes(fanName.toLocaleLowerCase())) {
            fan.remove()
        }
    }
}

chrome.runtime.onMessage.addListener(listOfFanNames => {
    listOfFanNames.forEach(fanName => removeFanByName(fanName));
});
