<script lang="ts" setup>
import { TransitionFade } from '@miraiui-org/vue-transition-fade';
import { Button as MButton } from '@miraiui-org/vue-button';

const { direction = 'ltr', asideSticky = false, asideExternalClass = '', layoutRootExternalClass = '' } = defineProps<{
  direction?: 'rtl' | 'ltr';
  asideSticky?: boolean;
  asideExternalClass?: string;
  layoutRootExternalClass?: string;
}>();
const appState = useState<AppState>('appState');

const closeDrawer = () => {
  appState.value.drawer = false;
};
</script>

<template>
  <div
    class="flex w-full gap-4 h-full transition"
    :class="{
      'flex-row-reverse': direction === 'rtl',
      [layoutRootExternalClass]: true,
    }"
  >
    <section class="flex-grow flex-shrink">
      <slot />
    </section>
    <teleport
      to="body"
      :disabled="!appState.drawer"
    >
      <aside
        :data-drawer="appState.drawer"
        :data-sticky="asideSticky"
        class="
          transition
          shrink-0 w-80 h-full grow-0 basis-auto data-[drawer=true]:animate-fade-right animate-duration-300
          data-[drawer=false]:md:block data-[drawer=false]:md:static data-[drawer=false]:hidden
          data-[drawer=true]:bg-default-200 data-[drawer=true]:z-50 data-[drawer=true]:p-4
          data-[drawer=true]:fixed data-[drawer=true]:top-0 data-[drawer=true]:left-0
          data-[sticky=true]:data-[drawer=false]:sticky data-[sticky=true]:data-[drawer=false]:top-20
      "
        :class="{
          [asideExternalClass]: true,
        }"
      >
        <slot name="aside" />
      </aside>
      <transition-fade>
        <div
          v-if="appState.drawer"
          class="w-full h-full bg-black/50 fixed top-0 z-40"
          @click="closeDrawer"
        />
      </transition-fade>
    </teleport>
  </div>
</template>
