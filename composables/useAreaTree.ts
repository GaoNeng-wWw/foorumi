import type { TreeSelectData } from '~/components/AppTreeSelect/index.vue';
import type { TreeData } from '~/components/tree/index.vue';

export const useAreaTree = () => {
  const { data, status, error, refresh } = useFetch('/api/area', { method: 'get', query: { page: 1, size: 100 }, server: false });
  const toTreeData = (node: Area): TreeData => {
    return {
      id: node.id.toString(),
      label: node.name,
      children: [],
    };
  };
  const toTreeSelectData = (node: TreeData): TreeSelectData<string> => {
    return {
      value: node.id,
      label: node.label,
      children: node.children?.map(child => toTreeSelectData(child)),
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
  const treeData = computed(() => {
    return data.value ? buildTree(data.value.data) : [];
  });
  const isEmpty = computed(() => Boolean(treeData.value.length));
  const loading = computed(() => status.value === 'pending');
  const flatTree = computed<Area[]>(() => data.value?.data ?? []);
  const treeSelectData = computed(() => {
    return treeData.value.map(child => toTreeSelectData(child));
  });
  return { treeData, isEmpty, loading, error, refresh, flatTree, treeSelectData };
};
