import { Network } from 'vis-network';

var nodes, edges, network, selected_edge_id, selected_node_id;
var node_index = 0;
var edge_index = 0;
var node_selected = false;
var edge_selected = false;
var editing = false;
let doesTheUserWantDashedEdges = false;

/*
 * =================================================
 *                UTILITIES
 * =================================================
 */

// convenience method to stringify a JSON object
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}

function addNodeWithLabel(label, node_id) {
  nodes.add({
    id: String(node_id),
    label,
  });
}

function giveMessageToUser(msg) {
  document.getElementById("message-xButton").onclick =
    clearMessagePopUp.bind(this);
  document.getElementById("message-closeButton").onclick =
    clearMessagePopUp.bind(this);
  document.getElementById("message-popUp").style.display = "block";
  document.getElementById("message").innerHTML = msg;
}

function editNode2() {
  try {
    node_id = selected_node_id;
    node = nodes.get(node_id);
    nodes.remove({ id: node_id });
    nodes.add({
      id: node_id,
      label: document.getElementById("instr").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeNode() {
  edge_ids = edges.getIds()
  try {
    for (let i = 0; i < edge_ids.length; i++) {
      edge_id = edge_ids[i];
      edge = edges.get(edge_id);
      if (edge.to === selected_node_id || edge.from === selected_node_id) {
        edges.remove({ id: edge_id });
        sol_edges.remove({ id: edge_id });
      }
    }
    nodes.remove({ id: selected_node_id });
  } catch (err) {
    alert(err);
  }
}

function addSol_Edge(data) {
  var bool = doesTheUserWantDashedEdges;
  to = nodes.get(data.to).label;
  from = nodes.get(data.from).label;
  try {
    sol_edges.add({
      id: data.id,
      from: from,
      to: to,
      dashes: bool
    });

  } catch (err) {
    alert(err);
  }
}

function updateEdge() {
  try {
    edges.update({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeEdge(id) {
  try {
    edges.remove({ id: id });
    sol_edges.remove({ id: id });
  } catch (err) {
    alert(err);
  }
}

function giveSelectedID(properties) {
  // if nodes were clicked:
  network.enableEditMode()
  if (properties.edges.length > 0) {
    edge_selected = true;
    selected_edge_id = properties.edges[0];
  }
  if (properties.nodes.length > 0) {
    node_selected = true;
    selected_node_id = properties.nodes[0];
  }
}

function editNode(data, cancelAction, callback, funct) {
  document.getElementById("node-saveButton").onclick = saveNodeData.bind(
    this,
    data,
    callback, funct
  );
  document.getElementById("node-cancelButton").onclick =
    cancelAction.bind(this, callback);
  document.getElementById("node-popUp").style.display = "block";
}

// Callback passed as parameter is ignored
/*UNUSED as of now? function clearNodePopUp() {
  document.getElementById("node-saveButton").onclick = null;
  document.getElementById("node-cancelButton").onclick = null;
  document.getElementById("node-popUp").style.display = "none";
}*/

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(data, callback, funct) {
  editNode2(data)
  clearNodePopUp();
  callback(data);
}

function clearMessagePopUp() {
  document.getElementById("message-closeButton").onclick = null;
  document.getElementById("message-popUp").style.display = "none";
}


function saveEdgeData(data, callback) {
  if (typeof data.to === "object") data.to = data.to.label;
  if (typeof data.from === "object") data.from = data.from.label;
  to = nodes.get(data.to).label;
  from = nodes.get(data.from).label;
  data.label = document.getElementById("label").value;
  data.id = edge_index;
  addEdge(data, to, from);
  clearEdgePopUp();
  callback(data);
}

/*
 * =================================================
 *                EVENT LISTENERS
 * =================================================
 */

// Note: for addSolidEdge & addDashedEdge, a manipulation callback will be executed that updates the "dashes" data field.
// TODO: Voor de volgende 2 functies
//       > toon aan de gebruiker de instructie "trek een pijl van een blok naar een ander blok".
//       (Tip1: maak een aparte functie voor dit soort berichten te tonen aan de gebruiker. Liefst geen alert want dat is storend, maar best gewoon een tekstkader op de pagina.)
//       (Tip2: Maak bovendien een aparte functie voor *fout*berichten te tonen aan de gebruiker. Error afhandeling kan dan onderliggend de functie van Tip1 aanroepen.)
function addSolidEdge() {
  doesTheUserWantDashedEdges = false;
  network.addEdgeMode();
  editing = true;
  document.getElementById("edgetext").innerHTML = "Trek een volle lijn van een blok naar een ander blok";
  document.getElementById("edgetext").style.display = "block"
}
function addDashedEdge() {
  doesTheUserWantDashedEdges = true;
  network.addEdgeMode();
  editing = true;
  document.getElementById("edgetext").innerHTML = "Trek een stippellijn van een blok naar een ander blok"
  document.getElementById("edgetext").style.display = "block"
}

function deleteSelected() {
  if (network.getSelection().nodes.length === 0 && network.getSelection().edges.length === 0) {
    giveMessageToUser("Niets geselecteerd")
    return;
  }
  if (network.getSelection().nodes.length !== 0) {
    try {
      selected_node_id =network.getSelection().nodes[0]
      var instructs = document.getElementById("instruction-listing")
      const instr_ids = network.getSelection().nodes[0].split(",")
      for(let i = 0;i<instr_ids.length;i++){
        delete instructs[instr_ids[i]].dataset.added
      }
      
    }
    catch (error) {
      //split function gives an error with our predefined blocks, shouldnt be an issue for students
    }
    removeNode()
  }
  if (network.getSelection().edges.length !== 0) {
    try {
      removeEdge(network.getSelection().edges[0])
    }
    catch (error) {
      //split function gives an error with our predefined blocks, shouldnt be an issue for students
    }
  }

  
  network.unselectAll();
}

function addNode() {
  const selected = Array.from(document.querySelectorAll("#instruction-listing option:checked"))
  if(selected.length ===0){
    giveMessageToUser("Niets geselecteerd");
    return;
  } 
  var prev_id = selected[0].id - 1;
  const node_id = []
  for (let i = 0; i < selected.length; i++) {
    if (Boolean(selected[i].dataset.added) === true) {
      giveMessageToUser("Instructies geselecteerd die al gebruikt zijn")
      return
    }
    if (selected[i].id - 1 != prev_id) {
      giveMessageToUser("Instructies moeten elkaar opvolgen")
      return
    }
    else {
      prev_id = selected[i].id
    }
  }
  for (let i = 0; i < selected.length; i++) {
    selected[i].dataset.added = true;
    node_id.push(selected[i].id)
  }
  const text = selected.map(element => element.innerText).join("\n");
  if (text === "") giveMessageToUser("Niets geselecteerd")
  addNodeWithLabel(text, node_id);
}

function copySolution() {
  let solutionNodes = [];
  let solutionEdges = []
  const copyNodes = nodes.get()
  const copyEdges = sol_edges.get()

  for (let i = 0; i < copyNodes.length; i++) {
    solutionNodes.push(copyNodes[i].label);
  }
  solutionNodes = solutionNodes.filter(function (i) {
    if (i != null || i != false)
      return i;
  }).join("|");

  for (let i = 0; i < copyEdges.length; i++) {
    solutionEdges.push(copyEdges[i].from + "-" + copyEdges[i].to);
  }
  solutionEdges = solutionEdges.filter(function (i) {
    if (i != null || i != false)
      return i;
  }).join("|");

  solution = "Nodes: [" + solutionNodes.toString() + "]\nEdges: [" + solutionEdges + "]"
  console.log(solution)
  navigator.clipboard.writeText(solution)
}

/*
 * =================================================
 *                DATA SECTION
 * =================================================
 */

function initDemoGraph() {
  nodes.add([
    { id: 501, x: -200, y: -100, label: "main: mov eax, 2 \ncall abs" },
    { id: 502, x: 0, y: 0, label: "abs: push edx\nmov edx, eax\ncmp edx, 0\njns pos" },
    { id: 503, x: 100, y: -100, label: "neg edx" },
    { id: 504, x: 200, y: 0, label: "pos: mov eax, edx\npop edx\nret" },
    { id: 505, x: 0, y: 100, label: "mov r, eax" },
  ]);
  edges.add([
    { id: 501, from: 501, to: 502, dashes: false },
    { id: 502, from: 501, to: 505, dashes: true },
    { id: 503, from: 502, to: 503, dashes: true },
    { id: 504, from: 502, to: 504, dashes: false },
    { id: 505, from: 503, to: 504, dashes: true },
    { id: 506, from: 504, to: 505, dashes: false },
  ]);
  sol_edges.add([
    { id: 501, from: "main: mov eax, 2 \ncall abs", to: "abs: push edx\nmov edx, eax\ncmp edx, 0\njns pos", dashes: false },
    { id: 502, from: "main: mov eax, 2 \ncall abs", to: "mov r, eax", dashes: true },
    { id: 503, from: "abs: push edx\nmov edx, eax\ncmp edx, 0\njns pos", to: "neg edx", dashes: true },
    { id: 504, from: "abs: push edx\nmov edx, eax\ncmp edx, 0\njns pos", to: "pos: mov eax, edx\npop edx\nret", dashes: false },
    { id: 505, from: "neg edx", to: "pos: mov eax, edx\npop edx\nret", dashes: true },
    { id: 506, from: "pos: mov eax, edx\npop edx\nret", to: "mov r, eax", dashes: false },
  ]);
}

// Example code taken from https://github.com/wodsaegh/vop-dodona/blob/master/exercise/narayana/solution/correctx86-32-intel.s
// In the future this should come from Dodona
const code =
  `narayana:
mov edi, dword ptr [esp+4]
mov eax, 0
call narayana_hulp
ret
narayana_hulp:
cmp edi, 2
jg  L4
inc eax
ret
L4:
dec edi
call narayana_hulp
sub edi, 2
call narayana_hulp
add edi, 3
ret`;

/*
 * =================================================
 *                INITIALIZATION
 * =================================================
 */

function registerEventListeners() {
  // Mouse events
  document.getElementById("btn-delete").onclick = deleteSelected;
  document.getElementById("btn-addNode").onclick = addNode;
  document.getElementById("btn-addSolidEdge").onclick = addSolidEdge;
  document.getElementById("btn-addDashedEdge").onclick = addDashedEdge;

  // Maps a keyboard shortcut key to a function to execute
  const keyboardShortcutToFunction = new Map;
  keyboardShortcutToFunction.set("s", addSolidEdge);
  keyboardShortcutToFunction.set("d", addDashedEdge);
  keyboardShortcutToFunction.set("delete", deleteSelected);

  // Link keyboard events using the above-defined map
  document.getElementById("mynetwork").onkeydown = function (e) {
    const action = keyboardShortcutToFunction.get(e.key.toLowerCase());
    if (action) {
      action();
    }
  };
}

function fillInstructionListing() {
  const fragment = document.createDocumentFragment();
  var inst_index = 0;
  for (const line of code.split("\n")) {
    const option = document.createElement("option");
    option.innerText = line;
    option.id = inst_index
    fragment.appendChild(option);
    inst_index += 1
  }

  document.getElementById("instruction-listing").appendChild(fragment);
}

function createVisJS() {
  // create an array with nodes
  nodes = new vis.DataSet();
  nodes.on("*", function () {
    document.getElementById("nodes").innerText = JSON.stringify(
      nodes.get(),
      null,
      4
    );
  });

  // create an array with edges
  sol_edges = new vis.DataSet();
  sol_edges.on("*", function () {
    document.getElementById("sol_edges").innerText = JSON.stringify(
      sol_edges.get(),
      null,
      4
    );
  });

  edges = new vis.DataSet();
  edges.on("*", function () {
    document.getElementById("edges").innerText = JSON.stringify(
      edges.get(),
      null,
      4
    );
  });

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: { color: { background: "white", border: "black" }, shape: "box", font: { face: "monospace", align: "left" }, size: 150 },
    edges: { arrows: { to: { enabled: true } }, smooth: { enabled: false } },
    interaction: {
      keyboard: true, navigationButtons: true
    },
    physics: false,
    layout: {
      improvedLayout: true,
    },
    manipulation: {
      enabled: false,
      addEdge: function (data, callback) {
        data['dashes'] = doesTheUserWantDashedEdges;
        data["id"] = edge_index+=1
        addSol_Edge(data)
        callback(data);
        document.getElementById("edgetext").style.display = "none"
      },
      deleteEdge: function (data, callback) {
        removeEdge(data);
        callback(data);
      },
      deleteNode: function (data, callback) {
        removeNode(data);
        callback(data);
      },
    },
  };
  network = new vis.Network(container, data, options);
  network.on("click", function () {
    if (editing === true) {
      console.log("hey")
      document.getElementById("edgetext").style.display = "none"    //ignore this currently
      network.disableEditMode()
      editing = false;
    }
  });
  
}

function init() {
  registerEventListeners();
  fillInstructionListing();
  createVisJS();
  initDemoGraph();
}