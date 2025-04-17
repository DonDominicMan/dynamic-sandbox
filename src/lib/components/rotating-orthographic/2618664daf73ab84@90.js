// import * as d3 from 'd3';
// import { feature } from 'topojson-client';

// function _1(md){return(
// md`# Rotating orthographic

// The [orthographic](/@d3/orthographic) projection is a type of azimuthal projection. Here only the visible front hemisphere is shown using [great-circle](http://en.wikipedia.org/wiki/Great_circle) clipping.`
// )}

// function* _map(DOM,width,height,d3,projection,graticule,land,inset)
// {
//   const vx = 0.001, vy = -0.001;
//   const context = DOM.context2d(width, height);
//   const path = d3.geoPath(projection, context);
//   context.canvas.style.width = "100%";
//   while (true) {
//     const t = performance.now();
//     projection.rotate([vx * t, vy * t]);
//     context.save();
//     context.beginPath();
//     projection.precision(0.2);
//     path(graticule);
//     context.globalAlpha = 0.1;
//     context.stroke();
//     context.beginPath();
//     projection.precision(0);
//     path(land);
//     context.globalAlpha = 1;
//     context.fill();
//     context.beginPath();
//     context.lineWidth = 2;
//     context.arc(width / 2, height / 2, width / 2 - inset, 0, 2 * Math.PI, false);
//     context.stroke();
//     context.restore();
//     yield context.canvas;
//     context.clearRect(0, 0, width, height);
//   }
// }


// function _projection(d3,inset,width,height,outline){return(
// d3.geoOrthographic().fitExtent([[inset, inset], [width - inset, height - inset]], outline)
// )}

// function _inset(){return(
// 20
// )}

// function _width(){return(
// 960
// )}

// function _height(){return(
// 960
// )}

// function _outline(){return(
// {type: "Sphere"}
// )}

// function _graticule(d3){return(
// d3.geoGraticule10()
// )}

// function _land(topojson,world){return(
// topojson.feature(world, world.objects.land)
// )}

// function _world(FileAttachment){return(
// FileAttachment("land-50m.json").json()
// )}

// export default function define(runtime, observer) {
//   const main = runtime.module();
//   function toString() { return this.url; }
//   const fileAttachments = new Map([
//     ["land-50m.json", {url: new URL("./files/7b6ff41e373e01d7b5b95773e297d40625bd9ccc1936a023a066a7edd8da5eaadec4ab7a565303539e41e001f2e6730f3ee1e259fae4f19dc59e8d6b2f2ec22b.json", import.meta.url), mimeType: "application/json", toString}]
//   ]);
//   main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
//   main.variable(observer()).define(["md"], _1);
//   main.variable(observer("map")).define("map", ["DOM","width","height","d3","projection","graticule","land","inset"], _map);
//   main.variable(observer("projection")).define("projection", ["d3","inset","width","height","outline"], _projection);
//   main.variable(observer("inset")).define("inset", _inset);
//   main.variable(observer("width")).define("width", _width);
//   main.variable(observer("height")).define("height", _height);
//   main.variable(observer("outline")).define("outline", _outline);
//   main.variable(observer("graticule")).define("graticule", ["d3"], _graticule);
//   main.variable(observer("land")).define("land", ["topojson","world"], _land);
//   main.variable(observer("world")).define("world", ["FileAttachment"], _world);
//   return main;
// }


// observable-viz.js (updated)
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import landData from './files/7b6ff41e373e01d7b5b95773e297d40625bd9ccc1936a023a066a7edd8da5eaadec4ab7a565303539e41e001f2e6730f3ee1e259fae4f19dc59e8d6b2f2ec22b.json'; // Direct import

function* _map(DOM, width, height, d3, projection, graticule, land, inset) {
  const vx = 0.001, vy = -0.001;
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);
  context.canvas.style.width = "100%";
  while (true) {
    const t = performance.now();
    projection.rotate([vx * t, vy * t]);
    context.save();
    context.beginPath();
    projection.precision(0.2);
    path(graticule);
    context.globalAlpha = 0.1;
    context.stroke();
    context.beginPath();
    projection.precision(0);
    path(land);
    context.globalAlpha = 1;
    context.fill();
    context.beginPath();
    context.lineWidth = 2;
    context.arc(width / 2, height / 2, width / 2 - inset, 0, 2 * Math.PI, false);
    context.stroke();
    context.restore();
    yield context.canvas;
    context.clearRect(0, 0, width, height);
  }
}


function _projection(d3, inset, width, height, outline) {
  return d3.geoOrthographic().fitExtent([[inset, inset], [width - inset, height - inset]], outline)
}

export function createVisualization(canvasElement) {
  const width = 960;
  const height = 960;
  const inset = 20;
  const context = canvasElement.getContext('2d');

  // Initialize D3 components
  const projection = d3.geoOrthographic()
    .fitExtent([[inset, inset], [width - inset, height - inset]], {type: "Sphere"});
  
  const path = d3.geoPath(projection, context);
  const graticule = d3.geoGraticule10();
  const land = feature(landData, landData.objects.land);

  // Animation logic (from _map)
  function animate(t) {
    projection.rotate([0.001 * t, -0.001 * t]);
    
    context.clearRect(0, 0, width, height);
    context.save();
    
    // Draw graticule
    context.beginPath();
    path(graticule);
    context.globalAlpha = 0.1;
    context.stroke();
    
    // Draw land
    context.beginPath();
    path(land);
    context.globalAlpha = 1;
    context.fill();
    
    // Draw outline
    context.beginPath();
    context.arc(width/2, height/2, width/2 - inset, 0, 2 * Math.PI);
    context.stroke();
    
    context.restore();
    requestAnimationFrame(animate);
  }

  return {
    start: () => requestAnimationFrame(animate),
    stop: () => cancelAnimationFrame(animate)
  };
}