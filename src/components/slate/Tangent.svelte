<script>
  import { interpret } from "$lib/evalutor";

  export let tangent;
  export let w,h;
  export let params;
  export let pageParams;
  export let grid;
  export let focus;
  export let highlight;

  function setHighlight() {
    highlight({id: tangent.id, label: tangent.label, type: "tangent", color: tangent.color})
  }

  const dasharray = {S: "0", D: `${tangent.w} ${2*tangent.w}`, d: `.5 ${3*tangent.w}`};
  function getPoints(params, page, pt) {
    const tPt = interpret(pt, params, page, 0);
    const slope = interpret(tangent.fp, params, page, tPt);
    const gridDom = (grid.r - grid.l);
    const cosineLength = Math.cos(Math.atan(slope))*tangent.l;
    const tangentStartPct = (tPt-cosineLength/2 - grid.l)/gridDom;
    const tangentLengthPct = cosineLength/gridDom;
    const gridRng = (grid.t - grid.b);

    let mathX, mathY, pctX, pctY;
    let points = "";

    let i = 0;
    do {
      pctX = tangentStartPct + (i * tangentLengthPct);
      mathX = pctX * gridDom + grid.l;
      mathY = interpret(tangent.f, params, page, tPt) + slope * (mathX - tPt);
      pctY = (mathY - grid.b) / gridRng;
      points += `${pctX*w},${h - pctY*h} `;
      i++;
    } while (i < 2);
    return points;
  };

  $: points = getPoints(params, pageParams, tangent.pt);
</script>

<polyline points={points} fill="none" stroke={tangent.color} stroke-width={tangent.w}
  stroke-dasharray={dasharray[tangent.stroke]} stroke-linecap="round" />
<polyline class="cpt" points={points} fill="none" stroke-width="16" stroke={tangent.color}
  opacity={focus === "t" ? '.2' : '0'} stroke-linecap="round" on:click={setHighlight} />

