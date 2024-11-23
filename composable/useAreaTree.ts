import type { TreeData } from '~/components/tree/tree.vue';

export const useAreaTree = () => {
  const { data, status, error, refresh } = useFetch<Area[]>('/api/area', { method: 'get' });
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
      if (area.id === id) {
        const children = buildTree(areas, area.id);
        const node = toTreeData(area);
        node.children = children;
        tree.push(node);
      }
    }
    return tree;
  };
  const treeData = computed(() => data.value ? buildTree(data.value) : []);
  const isEmpty = computed(() => Boolean(treeData.value.length));
  const loading = computed(() => status.value === 'pending');
  return { treeData, isEmpty, loading, error, refresh };
};
