<script>
  import { lessonStore } from "$lib/stores/learn";
  import { makeId } from "$lib/helpers";

  import Graph from "$comp/slate/Graph.svelte";
  import Text from "./inputs/Text.svelte";
  import Function from "./inputs/Function.svelte";
  import Numeric from "./inputs/Numeric.svelte";
  import ColorPicker from "./inputs/ColorPicker.svelte"
  import Checkbox from "./inputs/Checkbox.svelte";
  import Range from "./inputs/Range.svelte";
  import Markdown from "./inputs/Markdown.svelte";

  export let lessonId;
  export let graphs = {};
  export let page = [];
  export let params = {};
  export let pageParams = [];
  export let highlighted;
  export let highlight;
  export let savePage;
  export let pageNo;
  const TABS = ["Graph","Axes","Params","Curves","Tangents","Points","Areas"];
  const POS = ["t0 l0","t0 cx","t0 r0","cy l0","abcent","cy r0","b0 l0","b0 cx","b0 r0"];
  let activeTab = TABS[0];
  let confirmRemove = null;

  let graphList = false;
  function toggleGraphList() {graphList = !graphList};

  let selectedGraph = null;
  let pageGraphIndex;
  function setGraph(graph) {
    if (selectedGraph && selectedGraph.id === graph.id) {
      selectedGraph = null;
      pageGraphIndex = undefined;
    } else {
      selectedGraph = graph;
      pageGraphIndex = page.findIndex(p => p.id === graph.id);
    }
  };

  let expandRow = null;
  function toggleRow(id) {
    if (expandRow === id) expandRow = null;
    else expandRow = id;
  };

  function copyId(ref, id) {
    navigator.clipboard.writeText(`::${selectedGraph.id}-${ref}-${id}::`)
  }
  function copyParam(key) {
    navigator.clipboard.writeText(`%[${key}]%`)
  }

  function addGraph() {
    const id = makeId(3);
    graphs[id] = {
      id, label:"New Graph",
      w:400, h:300,
      scope: {l: 0, r: 10, t: 10, b: 0},
      grid: {show: false,color:"#000",opacity:5,stroke:"d"},
      axes: {X:{id:"X",axis:"x",color:"#000",stroke:"S",w:2,pos:0,size:0.8,label:"",shift:2,arrow:"r",neg:false},Y:{id:"Y",axis:"y",color:"#000",stroke:"S",w:2,pos:0,size:0.8,label:"",shift:2,arrow:"r",neg:false}},
      curves: {},
      tangents: {},
      areas: {},
      points: {},
    };
    graphs = graphs;
  }

  let confirmClearGraph = null;
  function showGraph(key) {
    const idx = page.findIndex(p => p.id === key);
    if (idx === -1) page.push({
      id:key, pos: "abcent", scale: 100, rotate: 0,
      areas: [],
      axes: ["X","Y"],
      curves: [],
      tangents: [],
      points: [],
    });
    else {
      if (confirmClearGraph === key) {
        page.splice(idx,1);
        confirmClearGraph = null;
      }
      else confirmClearGraph = key;
    }
    page = page;
  }

  function addAxis() {
    const id = makeId(2);
    selectedGraph.axes[id] = {
      id,
      axis: "x",
      pos: 0,
      color: "#000", w: 1,
      label:"",
      stroke: "S",
      size:1,
      shift: 0, arrow:"",
      neg:false
    };
    updateGraphs();
  }
  
  let newParamName = "";
  function addParam() {
    $lessonStore[lessonId].params[newParamName] = {
      name: newParamName,
      tMd: "",
      tag: "",
      label: "",
      value: 5,
      min: 0,
      max: 10,
      step: .2,
    };
    newParamName = "";
    updateGraphs();
  };
  function toggleFixedParam(key) {
    if (pageParams[key].fixed) delete pageParams[key].fixed;
    else pageParams[key].fixed = true;
    pageParams = pageParams;
  }
  function togglePageValues(key) {
    if (pageParams[key].hasOwnProperty("min")) pageParams[key] = {value: pageParams[key].value};
    else pageParams[key] = {
      value: params[key].value,
      min: params[key].min,
      max: params[key].max,
      step: params[key].step
    };
    pageParams = pageParams;
  }
  
  function addCurve() {
    const id = makeId(3);
    selectedGraph.curves[id] = {
      id,
      label: "",
      fStr: "", f: [],
      res: 2,
      w: 3,
      stroke: "S",
      dStr: ["0","10"],
      domain: [[{type: 'd', value: '0'}],[{type: 'd', value: '10'}]]
    };
    updateGraphs();
  }

  function addTangent() {
    const id = makeId(4);
    selectedGraph.tangents[id] = {
      id,
      label: "",
      fStr: "",
      f: [],
      fpStr: "",
      fp: [],
      stroke: "d",
      w: 1,
      l: 2
    };
    updateGraphs();
  };

  function addPoint() {
    const id = makeId(5);
    console.log("POINT ID", id)
    selectedGraph.points[id] = {
      id,
      label: "",
      xStr:"",yStr:"",
      x:[],y:[],
      r: 6,
      show: true,
      circ: false,
      w: 5, 
      markX: false,
      xLMd:"", xS:"d",xW:1,
      markY: false,
      yLMd:"", yS:"d",yW:1
    };
    updateGraphs();
  }

  function addArea() {
    const id = makeId(4);
    selectedGraph.areas[id] = {
      id,
      label: "",
      opacity: 5,
      w: 0,
      verts:[]
    };
    updateGraphs();
  }
  function addVert(areaId) {
    selectedGraph.areas[areaId].verts.push({xStr:"",yStr:"",x:[],y:[]});
    updateGraphs();
  }
  function addEdge(areaId) {
    selectedGraph.areas[areaId].verts.push({fStr:"",dStr:[],f:[],domain: [[{type: 'd', value: '0'}],[{type: 'd', value: '10'}]],res:4});
    updateGraphs();
  }

  function moveVert(areaId,dir,vIdx) {
    selectedGraph.areas[areaId].verts.splice(vIdx+dir, 0, selectedGraph.areas[areaId].verts.splice(vIdx, 1)[0]);
    updateGraphs();
  }


  function showElement(type,key,g=null) {
    let idx;
    switch (type) {
        case "x": 
          idx = page[g].axes.indexOf(key);
          if (idx === -1) page[g].axes.push(key);
          else page[g].axes.splice(idx,1);
          break;
        case "p": 
          if (!pageParams) {
            pageParams = {};
            pageParams[key] = {value: params[key].value};
          } else if (pageParams.hasOwnProperty(key)) delete pageParams[key];
          else pageParams[key] = {value: params[key].value};
          pageParams = pageParams;
          $lessonStore[lessonId].pages[pageNo].params = pageParams;
          break;
        case "t": 
          idx = page[g].tangents.indexOf(key);
          if (idx === -1) page[g].tangents.push(key);
          else page[g].tangents.splice(idx,1);
          break;
        case "c": 
          idx = page[g].curves.indexOf(key);
          if (idx === -1) page[g].curves.push(key);
          else page[g].curves.splice(idx,1);
          break;
        case "a": 
          idx = page[g].areas.indexOf(key);
          if (idx === -1) page[g].areas.push(key);
          else page[g].areas.splice(idx,1);
          break;
        case "o": 
          idx = page[g].points.indexOf(key);
          if (idx === -1) page[g].points.push(key);
          else page[g].points.splice(idx,1);
          break;
    }
    page = page;
  }

  function removeElement() {
    switch (confirmRemove[0]) {
      case "g": delete graphs[confirmRemove[1]]; break;
      case "x": delete selectedGraph.axes[confirmRemove[1]]; break;
      case "p": delete $lessonStore[lessonId].params[confirmRemove[1]]; break;
      case "t": delete selectedGraph.tangents[confirmRemove[1]]; break;
      case "c": delete selectedGraph.curves[confirmRemove[1]]; break;
      case "a": delete selectedGraph.areas[confirmRemove[1]]; break;
      case "v": selectedGraph.areas[confirmRemove[1]].verts.splice(confirmRemove[2], 1); break;
      case "o": delete selectedGraph.points[confirmRemove[1]]; break;
    }
    confirmRemove = null;
    updateGraphs();
  }

  function updateGraphs() {
    selectedGraph = selectedGraph;
    graphs = graphs;
    params = params;
  };
  async function saveGraphs() {
    graphs = graphs;
    const res = await fetch("/dashboard/lessons/", {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({id: lessonId, payload: {graphs, params} }),
    });
    if (res.ok) {
      savePage();
    } else {}
  }
</script>

<div class="rel">
  <Graph {graphs} {page} {params} {pageParams} {highlighted} {highlight} />

  <div class="ab l0 t0">
    <button on:click={toggleGraphList} >Graphs</button>
    <button on:click={addGraph} class="i combo" >+</button>
    <button on:click={saveGraphs} class="btn-success" >Save</button>
    {#if graphList}
      <div class="menu jll" on:click|stopPropagation>
        {#each Object.values(graphs) as graph}
          <div class="row nw">
            <button on:click={() => showGraph(graph.id)} class:btn-success={page.findIndex(p => p.id === graph.id) > -1} class="i">i</button>
            <button on:click={() => setGraph(graph)} disabled={page.findIndex(p => p.id === graph.id) === -1} class="bg0 p0">{graph.label}</button>
            <button on:click={() => confirmRemove = ["g", graph.id]} class="i btn-d">t</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if selectedGraph}
  <section class="jll modal">
    <div class="ed-tabs">
      {#each TABS as t}
        <button class="tab" on:click={() => activeTab=t} class:active={t===activeTab}>{t}</button>
      {/each}
    </div>
    <button class="i btn-close" on:click={() => selectedGraph = null}>x</button>
    <div class="ed-body">

      {#if activeTab==="Graph"}
        <Text bind:value={selectedGraph.label} label="Graph Label" />
        <div class="tal">
          <Numeric bind:value={selectedGraph.w} label="Width" width="6rem"/>
          <Numeric bind:value={selectedGraph.h} label="Height" width="6rem" />
          <Numeric bind:value={page[pageGraphIndex].scale} label="Scale %" width="6rem" />
          <Numeric bind:value={page[pageGraphIndex].rotate} label="Rotate (deg)" width="6rem" />
        <Checkbox label="Show Grid" bind:checked={selectedGraph.grid.show} width="16rem" />
        {#if selectedGraph.grid.show}
          <ColorPicker label="Color" bind:value={selectedGraph.grid.color} />
          <Range label="Opacity" bind:value={selectedGraph.grid.opacity} min="0" max="9" step="1" width="8rem" ordinal/>
          <label class="input-label" style="width:5rem"><span class="label-text">Stroke</span>
          <select class="input" bind:value={selectedGraph.grid.stroke}>
            <option value="S">━━━</option>
            <option value="D">╸╸╸</option>
            <option value="d">･･･</option>
          </select></label>
        {/if}
        </div>
        <div class="tac">
          <Numeric bind:value={selectedGraph.scope.t} label="Top" width="8.2rem" /><br>
          <Numeric bind:value={selectedGraph.scope.l} label="Left" width="8.2rem"/>
          <div class="pos-grid">
            {#each POS as p}
              <label><input bind:group={page[pageGraphIndex].pos} type="radio" value={p} name="pos"><p></p></label>
            {/each}
          </div>
          <Numeric bind:value={selectedGraph.scope.r} label="Right" width="8.2rem" /><br>
          <Numeric bind:value={selectedGraph.scope.b} label="Bottom" width="8.2rem" />
        </div>

      {:else if activeTab==="Axes"}
        {#each Object.values(selectedGraph.axes) as axis}
          <div class="row">
            <button on:click={() => showElement("x",axis.id,pageGraphIndex)} class:btn-success={page[pageGraphIndex].axes.indexOf(axis.id) > -1} class="i">i</button>
            <ColorPicker bind:value={axis.color} label="Color" />
            <label class="input-label" style="width:3.4rem"><span class="label-text">Axis</span>
              <select class="input" bind:value={axis.axis}>
                <option value="x">x</option>
                <option value="y">y</option>
            </select></label>
            <Markdown bind:value={axis.lMd} bind:html={axis.label} label="Tag" width="12rem" rows="1" />
            <label class="input-label" style="width:5rem"><span class="label-text">Stroke</span>
            <select class="input" bind:value={axis.stroke}>
              <option value="S">━━━</option>
              <option value="D">╸╸╸</option>
              <option value="d">･･･</option>
            </select></label>
            <Range label="Thickness" bind:value={axis.w} min="1" max="8" step="1" width="6rem" />
            <Numeric bind:value={axis.pos} label="Position" width="5rem" />
            <Numeric bind:value={axis.shift} label="Shift %" width="4rem" />
            <Numeric bind:value={axis.size} label="Font Size" width="5rem" />
            <label class="input-label" style="width:6rem"><span class="label-text">Arrow</span>
              <select class="input" bind:value={axis.arrow}>
                <option value="">None</option>
                <option value="l">Left</option>
                <option value="r">Right</option>
                <option value="lr">Both</option>
            </select></label>
            <Checkbox bind:checked={axis.neg} label="Negative" width="5rem" small/>
            <button on:click={() => confirmRemove = ["x", axis.id]} class="btn-d i">t</button>
          </div>
        {/each}
        <button on:click={addAxis} class="mt1"><i>+</i> Axis</button>

      {:else if activeTab==="Params"}
        {#each Object.entries($lessonStore[lessonId].params) as [key, param]}
          <div class="row">
            <button on:click={() => showElement("p",key)} class:btn-success={pageParams && pageParams.hasOwnProperty(key)} class="i">F</button>
            <b>{key}</b>
            <Markdown bind:value={param.tMd} bind:html={param.tag} label="Tag" width="12rem" rows="1" />
            <Numeric bind:value={param.value} label="Base Value" width="6rem" />
            <Numeric bind:value={param.min} label="Base Min" width="6rem" />
            <Numeric bind:value={param.max} label="Base Max" width="6rem" />
            <Numeric bind:value={param.step} label="Base Step" width="6rem" />
            <button class="i" on:click={copyParam(key)}>l</button>
            <button class="btn-d i" on:click={() => confirmRemove = ["p", key]} >t</button>
            <button class="i btn-p" on:click={() => toggleRow(key)}
              disabled={!params && !pageParams.hasOwnProperty(key)} >v</button>
            {#if expandRow === key}
              <div class="tal">
                <Text bind:value={param.label} label="Description" width="16rem"/>
                {#if pageParams && pageParams.hasOwnProperty(key)}
                  <Numeric bind:value={pageParams[key].value} label="Value" width="6rem" />
                  <button class:btn-success={pageParams[key].fixed} class="ts" on:click={() => toggleFixedParam(key)} >Fixed</button>
                  {#if !pageParams[key].fixed}
                    <button class:btn-success={!pageParams[key].hasOwnProperty('step')} class="ts"
                      on:click={() => togglePageValues(key)} >Use Base Values</button>
                    {#if pageParams[key].hasOwnProperty('step')}
                      <Numeric bind:value={pageParams[key].min} label="Min" width="6rem" />
                      <Numeric bind:value={pageParams[key].max} label="Max" width="6rem" />
                      <Numeric bind:value={pageParams[key].step} label="Step" width="6rem" />
                    {/if}
                  {/if}
                {/if}
              </div>
              <hr>
            {/if}
          </div>
        {/each}
        <div class="tal">
          <input type="text" bind:value={newParamName} class="input mt1" style="width: 5rem;" placeholder="Name">
          {#if newParamName.length === 1 && !$lessonStore[lessonId].params[newParamName]}
            <button on:click={addParam} ><i>+</i> Param</button>
          {/if}
        </div>

      {:else if activeTab==="Curves"}
        {#each Object.values(selectedGraph.curves) as curve}
          <div class="row">
            <button on:click={() => showElement("c",curve.id,pageGraphIndex)} class:btn-success={page[pageGraphIndex].curves.indexOf(curve.id) > -1} class="i">i</button>
            <ColorPicker bind:value={curve.color} label="Color" />
            <Text bind:value={curve.label} label="Label" width="19rem" />
            <Function bind:value={curve.fStr} bind:rpn={curve.f} label="Function" width="24rem" />
            <Numeric bind:value={curve.res} label="Resolution" width="5rem" />
            <button class="i" on:click={copyId("c", curve.id)}>l</button>
            <button on:click={() => confirmRemove = ["c", curve.id]} class="btn-d i">t</button>
            <button class="i btn-p" on:click={() => toggleRow(curve.id)}>v</button>
            {#if expandRow === curve.id}
              <label class="input-label" style="width:5rem"><span class="label-text">Stroke</span>
              <select class="input" bind:value={curve.stroke}>
                <option value="S">━━━</option>
                <option value="D">╸╸╸</option>
                <option value="d">･･･</option>
              </select></label>
              <Range label="Thickness" bind:value={curve.w} min=1 max=8 step=1 width="6rem" />
              <Function bind:value={curve.dStr[0]} bind:rpn={curve.domain[0]} label="Line Start" width="12rem" />
              <Function bind:value={curve.dStr[1]} bind:rpn={curve.domain[1]} label="Line End" width="12rem" />
              <hr>
            {/if}
          </div>
        {/each}
        <button on:click={addCurve} class="mt1"><i>+</i> Curve</button>

      {:else if activeTab==="Tangents"}
        {#each Object.values(selectedGraph.tangents) as tangent}
          <div class="row">
            <button on:click={() => showElement("t",tangent.id,pageGraphIndex)} class:btn-success={page[pageGraphIndex].tangents.indexOf(tangent.id) > -1} class="i">i</button>
            <ColorPicker bind:value={tangent.color} label="Tangent" />
            <Text bind:value={tangent.label} label="Label" width="20rem" />
            <Function bind:value={tangent.fStr} bind:rpn={tangent.f} label="Curve Function" width="24rem" />
            <button class="i" on:click={copyId("t", tangent.id)}>l</button>
            <button on:click={() => confirmRemove = ["t", tangent.id]} class="btn-d i">t</button>
            <button class="i btn-p" on:click={() => toggleRow(tangent.id)}>v</button>
            {#if expandRow === tangent.id}
              <Function bind:value={tangent.fpStr} bind:rpn={tangent.fp} label="Slope Function" />
              <Function bind:value={tangent.ptStr} bind:rpn={tangent.pt} label="Tangent Point X" width="10rem" />
              <label class="input-label" style="width:5rem"><span class="label-text">Stroke</span>
              <select class="input" bind:value={tangent.stroke}>
                <option value="S">━━━</option>
                <option value="D">╸╸╸</option>
                <option value="d">･･･</option>
              </select></label>
              <Range bind:value={tangent.w} label="Thickness" min="1" max='8' step="1" width="8rem" />
              <Numeric bind:value={tangent.l} label="Length" width="6rem"/>
              <hr>
            {/if}
          </div>
        {/each}
        <button on:click={addTangent} class="mt1"><i>+</i> Tangent</button>

      {:else if activeTab==="Areas"}
        {#each Object.values(selectedGraph.areas) as area}
          <div class="row">
            <button on:click={() => showElement("a",area.id,pageGraphIndex)} class:btn-success={page[pageGraphIndex].areas.indexOf(area.id) > -1} class="i">i</button>
            <ColorPicker label="Color" bind:value={area.color} />
            <Text bind:value={area.label} label="Label" width="18rem" />
            <Range label="Opacity" bind:value={area.opacity} min="0" max="7" step="1" width="8rem" ordinal/>
            <Range label="Thickness" bind:value={area.w} min="0" max="4" width="8rem" step="1"/>
            <button on:click={() => addVert(area.id)} class="mt1 ts pl0"><i>+</i> Vertex</button>
            <button on:click={() => addEdge(area.id)} class="mt1 ts pl0"><i>+</i> Edge</button>
            <button class="i" on:click={copyId("a", area.id)}>l</button>
            <button on:click={() => confirmRemove = ["a", area.id]} class="btn-d i">t</button>
            <button class="i btn-p" on:click={() => toggleRow(area.id)}>v</button>
            {#if expandRow === area.id}
              {#each area.verts as el, vIdx}
                <div class="tal ib"> {#if vIdx}<p class="i ib vab"> ➜</p>{/if}
                {#if el.f}
                  <p class="i ib vab">⨍</p>
                  <Function bind:value={el.fStr} bind:rpn={el.f} label="Edge Function" width="20rem" />
                  <Numeric bind:value={el.res} label="Resolution" width="5rem" />
                  <Function bind:value={el.dStr[0]} bind:rpn={el.domain[0]} label="Line Start" width="12rem" />
                  <Function bind:value={el.dStr[1]} bind:rpn={el.domain[1]} label="Line End" width="12rem" />
                {:else}
                  <p class="i ib vab">⏺</p>
                  <Function bind:value={el.xStr} bind:rpn={el.x} label="x" width="12rem" />
                  <Function bind:value={el.yStr} bind:rpn={el.y} label="y" width="12rem" />
                {/if}
                  {#if vIdx > 0}<button class="i" on:click={() => moveVert(area.id,-1,vIdx)}>^</button>{/if}
                  {#if vIdx < area.verts.length-1}<button class="i rt180" on:click={() => moveVert(area.id,1,vIdx)}>^</button>{/if}
                  <button on:click={() => confirmRemove = ["v", area.Id, vIdx]} class="btn-d i">t</button>
                </div>
              {/each}
              <hr>
            {/if}
          </div>
        {/each}
        <button on:click={addArea} class="mt1"><i>+</i> Area</button>

      {:else if activeTab==="Points"}
        {#each Object.values(selectedGraph.points) as pt}
          <div class="row tal">
            <button on:click={() => showElement("o",pt.id,pageGraphIndex)} class:btn-success={page[pageGraphIndex].points.indexOf(pt.id) > -1} class="i">i</button>
            <ColorPicker label="Color" bind:value={pt.color} />
            <Text bind:value={pt.label} label="Label" width="13.6rem" />
            <Function bind:value={pt.xStr} bind:rpn={pt.x} label="x" width="17.5rem" />
            <Function bind:value={pt.yStr} bind:rpn={pt.y} label="y" width="17.5rem" />
            <button class="i" on:click={copyId("o", pt.id)}>l</button>
            <button on:click={() => confirmRemove = ["o", pt.id]} class="btn-d i">t</button>
            <button class="i btn-p" on:click={() => toggleRow(pt.id)}>v</button>
            {#if expandRow === pt.id}
              <Range label="Radius" bind:value={pt.r} min="3" max="12" step="1" width="8rem"/>
              <Checkbox bind:checked={pt.show} label="Show Fill" width="6rem" small />
              <Checkbox bind:checked={pt.circ} label="Show Stroke" width="6rem" small />
              {#if pt.circ}
                <Range label="Thickness" bind:value={pt.w} min=1 max=6 step=1 width="6rem" />
                <ColorPicker bind:value={pt.sC} label="Color" width="5rem" />
              {/if}
              <div>
                <Checkbox bind:checked={pt.markX} label="Mark X" width="5rem" small />
                {#if pt.markX}
                  <ColorPicker bind:value={pt.xC} label="Color" />
                  <Markdown bind:value={pt.xLMd} bind:html={pt.xL} label="Label" width="9rem" rows="1" />
                  <label class="input-label" style="width:5rem"><span class="label-text">Stroke</span>
                    <select class="input" bind:value={pt.xS}>
                      <option value="S">━━━</option>
                      <option value="D">╸╸╸</option>
                      <option value="d">･･･</option>
                  </select></label>
                  <Range label="Thickness" bind:value={pt.xW} min=1 max=8 step=1 width="6rem" />
                {/if}
                <span class="pl3"></span>
                <Checkbox bind:checked={pt.markY} label="Mark Y" width="5rem" small />
                {#if pt.markY}
                  <ColorPicker bind:value={pt.yC} label="Color" />
                  <Markdown bind:value={pt.yLMd} bind:html={pt.yL} label="Label" width="9rem" rows="1" />
                  <label class="input-label" style="width:5rem"><span class="label-text">Stroke</span>
                    <select class="input" bind:value={pt.yS}>
                      <option value="S">━━━</option>
                      <option value="D">╸╸╸</option>
                      <option value="d">･･･</option>
                  </select></label>
                  <Range label="Thickness" bind:value={pt.yW} min=1 max=8 step=1 width="6rem" />
                {/if}
              </div>
            <hr>
          {/if}
          </div>
        {/each}
        <button on:click={addPoint} class="mt1"><i>+</i> Point</button>
      {/if}

    </div>
    <div style="margin: 1rem 0 -1rem; text-align: center;">
      <button on:click={updateGraphs}>Update</button>
      <button on:click={() => confirmRemove = ["g", selectedGraph.id]} class="btn-d">Remove</button>
      <button on:click={saveGraphs} class="btn-primary">Save</button>
    </div>
  </section>
{/if}

{#if confirmRemove && confirmRemove.length}
  <div class="overlay" on:click={() => confirmRemove = null}>
    <div class="modal" on:click|stopPropagation>
      {#if confirmRemove[0] === "g"}
        <h1>Remove Graph?</h1>
      {/if}
        <button on:click={removeElement} class="btn-danger">Delete</button>
    </div>
  </div>
{/if}

{#if confirmClearGraph}
  <div class="overlay" on:click={() => showGraph(null)}>
    <div class="modal" on:click|stopPropagation>
      Clear graph from page?
      <button on:click={() => showGraph(confirmClearGraph)} class="btn-danger i">t</button>
    </div>
  </div>
{/if}
