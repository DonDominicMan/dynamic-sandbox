// observable-viz.js (updated)
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import landData from './files/7b6ff41e373e01d7b5b95773e297d40625bd9ccc1936a023a066a7edd8da5eaadec4ab7a565303539e41e001f2e6730f3ee1e259fae4f19dc59e8d6b2f2ec22b.json'; // Direct import
// observable-viz.js
export function createInteractiveGlobe(canvasElement) {
  const width = 960;
  const height = 960;
  const inset = 20;
  const context = canvasElement.getContext('2d');
  const center = { x: width/2, y: height/2 };
  const maxRadius = width/2 - inset;

  // Rotation state
  let rotation = [0, 0];
  let isDragging = false;
  let lastMousePos = { x: 0, y: 0 };
  let autoRotate = true;
  const autoRotationSpeed = 0.05; // Default auto-rotation

  // D3 setup
  const projection = d3.geoOrthographic()
    .fitExtent([[inset, inset], [width - inset, height - inset]], {type: "Sphere"});
  
  const path = d3.geoPath(projection, context);
  const graticule = d3.geoGraticule10();
  const land = feature(landData, landData.objects.land);

  // Convert mouse position to rotation
  function mouseToRotation(x, y) {
    const dx = x - center.x;
    const dy = y - center.y;
    const distance = Math.min(Math.sqrt(dx*dx + dy*dy), maxRadius) / maxRadius;
    
    return [
      -dx * 0.2 * distance,  // Horizontal rotation (inverted for natural feel)
      dy * 0.1 * distance    // Vertical rotation (less sensitive)
    ];
  }

  // Event handlers
  function handleMouseDown(event) {
    isDragging = true;
    autoRotate = false;
    lastMousePos = getMousePos(event);
  }

  function handleMouseMove(event) {
    if (!isDragging) return;
    const mousePos = getMousePos(event);
    
    const deltaX = mousePos.x - lastMousePos.x;
    const deltaY = mousePos.y - lastMousePos.y;
    
    rotation[0] += deltaX * 0.2;
    rotation[1] -= deltaY * 0.1;
    
    lastMousePos = mousePos;
  }

  function handleMouseUp() {
    isDragging = false;
    autoRotate = true;
  }

  function getMousePos(event) {
    const rect = canvasElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  // Animation loop
  function animate(t) {
    if (autoRotate) {
      rotation[0] += autoRotationSpeed;
    }

    projection.rotate(rotation);
    
    // Clear and redraw
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
    context.arc(center.x, center.y, maxRadius, 0, 2 * Math.PI);
    context.stroke();
    
    context.restore();
    requestAnimationFrame(animate);
  }

  // Set up event listeners
  canvasElement.addEventListener('mousedown', handleMouseDown);
  canvasElement.addEventListener('mousemove', handleMouseMove);
  canvasElement.addEventListener('mouseup', handleMouseUp);
  canvasElement.addEventListener('mouseleave', handleMouseUp);

  // Start animation
  animate();

  return {
    destroy: () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mouseup', handleMouseUp);
      canvasElement.removeEventListener('mouseleave', handleMouseUp);
    }
  };
}