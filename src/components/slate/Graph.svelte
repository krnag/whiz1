<script>
  import Curve from "./Curve.svelte";
  import Tangent from "./Tangent.svelte";
  import ParamSlider from "./ParamSlider.svelte";
  import Point from "./Point.svelte";
  import Area from "./Area.svelte";

  export let graphs;
  export let page;
  export let pageParams;
  export let params;
  export let highlighted;
  export let highlight;

  //console.log("Setup>>>", pageParams)
  const updateParam = (key, val) => {
    pageParams[key].value = val;
    pageParams = pageParams;
  };

  function pos(axis, graph, singleAxis=false) {
    if (axis.axis==="x") {
      const x0 = axis.neg ? 1 : -graph.scope.l * graph.w/(graph.scope.r - graph.scope.l);
      const Y = graph.h * (1 - (axis.pos-graph.scope.b)/(graph.scope.t-graph.scope.b));
      return singleAxis ? Y+axis.size : `M${x0},${Y} ${graph.w-1},${Y}`;
    }
    const y0 = axis.neg ? graph.h+1 : graph.h + graph.scope.b * graph.h/(graph.scope.t - graph.scope.b);
    const X = graph.w * (axis.pos-graph.scope.l)/(graph.scope.r-graph.scope.l);
    return singleAxis ? X-axis.size*18 : `M${X},${y0} ${X},0`;
  }
</script>

<div class="slate rel">
  <div class="graph-frame rel">
    {#each page as g (g.id)}
      {@const w = graphs[g.id].w} {@const h = graphs[g.id].h} {@const grid = graphs[g.id].scope}
      <div class="graph-tile {g.pos}" style="width:{g.scale}%;">
        <svg viewBox="0 0 {w} {h}" width="100%" style="transform:rotate({g.rotate}deg)" >
          <defs>
            <marker id="larr" markerWidth="6" markerHeight="5" refX="1" refY="2.5" orient="auto"><polygon points="6 5, 0 2.5, 6 0" /></marker>
            <marker id="rarr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><polygon points="0 0, 6 2.5, 0 5" /></marker>
            <pattern id="stripes" width="4" height="4" patternUnits="userSpaceOnUse" >
              <line x1="0" y1="2" x2="2" y2="4" stroke="#000" />
              <line x1="2" y1="0" x2="4" y2="2" stroke="#000" />
            </pattern>
          </defs>
          {#each g.areas as i}
            {#if graphs[g.id].areas[i].verts.length > 1}
              <Area area={graphs[g.id].areas[i]} {params} {pageParams} {w} {h} {grid}
              focus={highlighted && highlighted.id === i} {highlight} />
            {/if}
          {/each}

          {#each g.axes as i}
            {@const axes = graphs[g.id].axes}
            <path d={pos(axes[i], graphs[g.id])} stroke={axes[i].color}
              marker-start={axes[i].arrow==="l"||axes[i].arrow==="lr" ? "url(#larr)":"none"}
              marker-end={axes[i].arrow==="r"||axes[i].arrow==="lr" ? "url(#rarr)":"none"}
              stroke-width={axes[i].w} stroke-linecap="round"
              stroke-dasharray={axes[i].stroke==="S" ? "0" : axes[i].stroke==="D" ? `${axes[i].w} ${2*axes[i].w}`: `.5 ${3*axes[i].w}`} />
          {/each}

          {#each g.curves as i}
            {@const curves = graphs[g.id].curves}
            {#if curves[i].f.length}
              <Curve curve={curves[i]} {params} {pageParams} {w} {h} {grid} 
                focus={highlighted && highlighted.id === i} {highlight} />
            {/if}
          {/each}

          {#each g.tangents as i}
            {@const tangents = graphs[g.id].tangents}
            {#if tangents[i].f.length && tangents[i].fp.length && tangents[i].pt.length}
              <Tangent tangent={tangents[i]} {params} {pageParams} {w} {h} {grid}
                focus={highlighted && highlighted.id === i} {highlight} />
            {/if}
          {/each}

          {#each g.points as i}
            {@const points = graphs[g.id].points}
            {#if points[i].x.length && points[i].y.length}
              <Point point={points[i]} {params} {pageParams} {w} {h} {grid} sizeX={graphs[g.id].axes["X"].size}
                sizeY={graphs[g.id].axes["Y"].size} focus={highlighted && highlighted.id === i} {highlight} />
            {/if}
          {/each}

          {#each g.axes as i}
            {@const axes = graphs[g.id].axes}
            {#if axes[i].axis === "x"}
              <foreignObject x="0" width="{100-axes[i].shift}%" height="{axes[i].size*2}rem" y={pos(axes[i],graphs[g.id],true)} class="usn">
                <div class="tar" style="font-size:{axes[i].size}rem;color:{axes[i].color}">{@html axes[i].label}</div>
              </foreignObject>
            {:else if axes[i].axis === "y"}
              <foreignObject x="-100%" y={pos(axes[i],graphs[g.id],true)} width="{100-axes[i].shift}%" height="{axes[i].size*2}rem" class="usn" style="transform:rotate(-90deg)">
                <div class="tar" style="font-size:{axes[i].size}rem;color:{axes[i].color}">{@html axes[i].label}</div>
              </foreignObject>
            {/if}
          {/each}
        </svg>
      </div>
    {/each}
  </div>

  <div class="graph-control">
    {#if pageParams}
      {#each Object.entries(pageParams) as [key, param]}
        {#if !pageParams[key].fixed}
          <ParamSlider {key} param={params[key]} page={pageParams[key]} {updateParam} focus={highlighted && highlighted.id === key} {highlight} />
        {/if}
      {/each}
    {/if}
  </div>

{#if highlighted}
  <div class="graph-label" on:click={() => highlight(null)} style="border-color:{highlighted.color}">
    {highlighted.label}
  </div>
{/if}
</div>
