<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue';
</script>

<template>
  <div class="w-full h-full bg-background">
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
    >
      <SplitterPanel
        id="splitter-group-1-panel-1"
        :min-size="20"
        :max-size="50"
        :default-size="20"
        class="w-40"
      >
        <slot name="aside" />
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="w-2"
      />
      <SplitterPanel
        id="splitter-group-1-panel-2"
        :min-size="20"
      >
        <slot />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
