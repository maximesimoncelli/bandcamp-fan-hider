// State Management
const state = {
  listOfFansToBlock: [],
};

// DOM Elements

const storageCleanButton = document.getElementById("storage_clean");
const listOfFansElement = document.getElementById("fan_list");
const fanAddButton = document.getElementById("fan_add");

const observer = new MutationObserver(function (mutationsList) {
  console.log(mutationsList);
  mutationsList[0].addedNodes.forEach((addedNode) => {
    addedNode.childNodes.forEach((fanNode) => {
      if (fanNode.classList && fanNode.classList.contains("remove_fan")) {
        fanNode.addEventListener("click", (event) => {
          const fanName = event.target.getAttribute("data-name");
          removeFan(fanName);
        });
      }
    });
  });
});

observer.observe(listOfFansElement, { childList: true });

// Initialization
chrome.storage.sync.get("listOfFansToBlock", (result) => {
  Object.assign(state, result);
  updateFanListUI();
  sendMessageToBandcampTabs();
});

// Functions
function sendMessageToBandcampTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs
      .filter((tab) => tab.url && tab.url.includes("bandcamp.com"))
      .forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, state.listOfFansToBlock);
      });
  });
}

function updateFanListUI() {
  listOfFansElement.innerHTML = state.listOfFansToBlock
    .map(
      (fan) =>
        `<div class="fan"><li>${fan}</li><svg class="remove_fan" data-name=${fan} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>`
    )
    .join("");
}

function removeFan(fanName) {
  state.listOfFansToBlock = state.listOfFansToBlock.filter(
    (fan) => fan.toLocaleLowerCase() !== fanName.toLocaleLowerCase()
  );
  chrome.storage.sync.set({ listOfFansToBlock: state.listOfFansToBlock });
  updateFanListUI();
}

function cleanStorage() {
  chrome.storage.sync.set({ listOfFansToBlock: [] });
  state.listOfFansToBlock = [];
  updateFanListUI();
}

// Event Listeners
fanAddButton.addEventListener("click", () => {
  if (document.getElementById("fan_name").value === "") return;
  state.listOfFansToBlock.push(document.getElementById("fan_name").value);
  chrome.storage.sync.set({ listOfFansToBlock: state.listOfFansToBlock });
  updateFanListUI();
  sendMessageToBandcampTabs();

  document.getElementById("fan_name").value = "";
});

storageCleanButton.addEventListener("click", cleanStorage);
