import * as d3 from 'd3';
import { feature } from 'topojson-client';
import landData from './files/custom_merged_countries_110m.json'; // Direct import

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
  const autoRotationSpeed = 0.08; // Default auto-rotation

  // D3 setup
  const projection = d3.geoOrthographic()
    .fitExtent([[inset, inset], [width - inset, height - inset]], {type: "Sphere"});
  
  const path = d3.geoPath(projection, context);
  const graticule = d3.geoGraticule10();
  const land = feature(landData, landData.objects.countries);

  // Event handlers
  function handleMouseDown(event) {
    console.log(event);
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

  
  // Start animation
  animate();
  
  // Set up event listeners
  canvasElement.addEventListener('mousedown', handleMouseDown);
  canvasElement.addEventListener('mousemove', handleMouseMove);
  canvasElement.addEventListener('mouseup', handleMouseUp);
  canvasElement.addEventListener('mouseleave', handleMouseUp);
  return {
    destroy: () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mouseup', handleMouseUp);
      canvasElement.removeEventListener('mouseleave', handleMouseUp);
    }
  };
}