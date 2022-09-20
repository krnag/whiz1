<script>
  import { interpret } from "$lib/evalutor";

  export let area;
  export let w, h;
  export let params;
  export let pageParams;
  export let grid;
  export let focus;
  export let highlight;

  function setHighlight() {
    highlight({id: area.id, label: area.label, type: "area", color: area.color})
  }

  const OPACITY = ["20","40","60","80","a0","b0","c0","d0","f0","ff"];

  function getPoints(params, page) {
    const gridDom = (grid.r - grid.l);
    const gridRng = (grid.t - grid.b);
    let points = "";
    for (let i = 0; i < area.verts.length; i++) {
      if(area.verts[i].x) { // Vertex
        const x = interpret(area.verts[i].x, params, page, 0);
        const y = interpret(area.verts[i].y, params, page, 0);
        const X = (x - grid.l)/gridDom * w;
        const Y = (y - grid.b)/gridRng * h;
        points += (`${Math.round(X)},${h - Math.round(Y)} `);
      } else { // Edge
        const dl = interpret(area.verts[i].domain[0], params, page, 0)
        const dr = interpret(area.verts[i].domain[1], params, page, 0)
        const gridDom = (grid.r - grid.l);
        const funcDomStartPct = (dl - grid.l)/gridDom;
        const funcDomLength = (dr - dl)/gridDom;
        let domPctX, mathX, mathY, percentX, percentY;
        for (let j = 0; j < area.verts[i].res; j++) {
          domPctX = j / (area.verts[i].res - 1);
          percentX = funcDomStartPct + (domPctX * funcDomLength);
          mathX = grid.l + percentX * gridDom;
          mathY = interpret(area.verts[i].f, params, page, mathX);
          percentY = (mathY - grid.b) / gridRng;
          points = points + `${Math.round(percentX*w)},${h - Math.round(percentY*h)} `
        }
      }
    }
    return points
  };
  $: points = getPoints(params, pageParams);
</script>

<polygon {points} fill="{area.color + OPACITY[focus?area.opacity+2:area.opacity]}" />
<polygon {points} class="cpt" fill="url(#stripes)" on:click={setHighlight} opacity="{focus?.2:0}" />
