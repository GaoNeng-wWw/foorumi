import type { TreeData } from '~/components/tree/tree.vue';

export const useAreaTree = () => {
  const { data, status, error, refresh } = useFetch('/api/area', { method: 'get', query: { page: 1 }, server: false });
  const toTreeData = (node: Area): TreeData => {
    return {
      id: node.id.toString(),
      label: node.name,
      children: [],
    };
  };
  const buildTree = (areas: Area[], id: number | null = null) => {
    const tree: TreeData[] = [];
    for (let i = 0; i < areas.length; i++) {
      const area = areas[i];
      if (area.parent === id) {
        const children = buildTree(areas, area.id);
        const node = toTreeData(area);
        node.children = children;
        node.meta = {
          ...area,
        };
        delete node.meta.id;
        delete node.meta.label;
        delete node.meta.children;
        delete node.meta.parent;
        tree.push(node);
      }
    }
    return tree;
  };
  const treeData = computed(() => data.value ? buildTree(data.value.data) : []);
  const isEmpty = computed(() => Boolean(treeData.value.length));
  const loading = computed(() => status.value === 'pending');
  const flatTree = computed<Area[]>(() => data.value?.data ?? []);
  return { treeData, isEmpty, loading, error, refresh, flatTree };
};
