import hh from "hyperscript-helpers";
import { test } from "ramda";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";


// allows using html tags as functions in javascript
const { div, button, p, h1, h2, input, table, tr, td, } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline";

// Messages which can be used to update the model
const MSGS = {
  INPUT_LOCATION: "INPUT_LOCATION",
  SAVE_INPUT: "SAVE_INPUT",
  INPUT_AWNSER: "INPUT_AWNSER",
  DELETE_ENTRY: "DELETE_ENTRY",
  UPDATE_ENTRY: "UPDATE_ENTRY",
  // ... ℹ️ additional messages
};




function deleteEntry(dispatch, entryId) {
  return () => {
    dispatch({ type: MSGS.DELETE_ENTRY, id: entryId });
  };
}

function updateEntry(dispatch, entry) {
  return () => {
    dispatch({ type: MSGS.DELETE_ENTRY, id: entry.id });
    // Gleichzeitig den bearbeiteten Eintrag ins Modell laden
    dispatch({ type: MSGS.UPDATE_ENTRY, entry });
  };
  
}



// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  if (!model) {
    
    return div({}, "Loading...");
  }

  return div({ className: "flex flex-col gap-4 " }, [
    h1({ className: "text-2xl" }, `Weather App`),
    div({className: "flex gap-2"}, [
      div({className: "flex gap-2"}, [
        input({ className: "shadow border-zinc-800", placeholder: "Enter Location...", oninput: (event) => dispatch(generateMessage(MSGS.INPUT_LOCATION, event.target.value)) }, ),
        input({ className: "shadow border-zinc-800", placeholder: "Enter Location...", oninput: (event) => dispatch(generateMessage(MSGS.INPUT_AWNSER, event.target.value)) }, ),
        button({ className: btnStyle, onclick: () => dispatch(generateMessage(MSGS.SAVE_INPUT))}, "Add"),
      ]),
    ]),
    
    
    
    
    div({ className: "min-w-full divide-y" }, [
      ...model.entries.map((entry) =>
        div({ className: "bg-amber-500 inline-block w-72 h-72" }, [
          h2({ className: "text-xl" }, `Card ${entry.id}`),
          p({ className: "" }, `Question : ${entry.locationName}`),
          button(
            { className: "", onclick: () => dispatch(generateMessage(MSGS.INPUT_AWNSER)) },
            "Show Awnser"
          ),
          p({ className: "" }, `Awnser : ${entry.awnser}`),
          // Button zum Löschen eines Eintrags
          button({ className: "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded", onclick: deleteEntry(dispatch, entry.id) }, "Delete Entry"),
          button(
            {
              className: btnStyle,
              onclick: () => dispatch(updateEntry(dispatch, entry)),
            },
            "Edit"
          )
        ])
      ),
    ]),
  ]);
}



const generateMessage = (msg, data) => {
  return {
    type: msg,
    data,
    
  };
  
};



// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  console.log(msg);
  switch (msg.type) {
    case MSGS.INPUT_LOCATION:
      return { ...model, nameLocation: msg.data };
    
    case MSGS.INPUT_AWNSER:
      return { ...model, awnser: msg.data };

      case MSGS.SAVE_INPUT:
        const location = model.nameLocation;
        const answer = model.answer;
        const id = model.id + 1; // Erhöhe die ID für den neuen Eintrag
        const entry = { id, locationName: location, answer };
        const entries = [...model.entries, entry];
        model.nameLocation = "";
      return { ...model, id, entries };

      case MSGS.DELETE_ENTRY:
        const deleteEntrie = model.entries.filter((entry) => entry.id !== msg.id);
      return { ...model, entries: deleteEntrie };

      case MSGS.UPDATE_ENTRY:
      // Setzen des editingEntry-Feldes auf den ausgewählten Eintrag
      return { ...model, editingEntry: msg.entry };

  }
  console.log(modele.entries);
}
console.log(module.entries)





// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  async function dispatch(msg) {
    model = await update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
    

  }
}



// The initial model when the app starts
const initModel = {
  nameLocation: "",
  id : 0,
  awnser: "",
  awnserState: true,
  entries: [],
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);


const makeAPICall = async () => {
  const URL = "url...";
  const data = await response.json()
  const respons = await fetch(URL);
  console.log(data.data)
};











