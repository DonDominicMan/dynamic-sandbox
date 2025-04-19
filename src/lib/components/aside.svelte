<script>
    let { feature, isOpen, toggleSidebar} = $props();
  </script>
  
  <div class="sidebar-container">
    <!-- Overlay when sidebar is open (for better UX) -->
    {#if isOpen}
      <div class="sidebar-overlay" on:click={toggleSidebar} />
    {/if}
  
    <aside class:open={isOpen}>
      <button class="toggle-btn" on:click={toggleSidebar}>
        {isOpen ? '◄' : '►'}
      </button>
      
      <div class="sidebar-content">
        <slot>{feature?.properties?.name}</slot>
      </div>
    </aside>
  
    <style>
      .sidebar-container {
        position: relative;
      }
  
      aside {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 50vw;
        background: rgba(40, 40, 60, 0.85);
        backdrop-filter: blur(8px);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s ease-out;
        z-index: 1000;
        display: flex;
      }
  
      aside.open {
        transform: translateX(0);
      }
  
      .sidebar-content {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
        color: white;
      }
  
      .toggle-btn {
        position: absolute;
        right: -2rem;
        top: 1rem;
        width: 2rem;
        height: 3rem;
        background: rgba(40, 40, 60, 0.85);
        border: none;
        border-radius: 0 4px 4px 0;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
  
      .toggle-btn:hover {
        background: rgba(60, 60, 80, 0.9);
      }
  
      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.3);
        z-index: 999;
      }
    </style>
  </div>