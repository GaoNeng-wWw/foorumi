<script lang="ts" setup>
import { useMessage } from '@miraiui-org/vue-message';

type BaseFile = {
  name: string;
  hash?: string;
  chunks: Blob[];
};
type IFile = (BaseFile & { status: 'pending' }) | (BaseFile & { status: 'success' }) | (BaseFile & { status: 'fail'; reason?: string });
const files = ref<IFile[]>([]);
const { public: { storage_limit, chunk_limit } } = useRuntimeConfig();
const fileQueue: File[] = [];
const createFile = (fileName: string, status: 'pending' | 'success' | 'fail', reason?: string, hash?: string) => {
  files.value.push(
    {
      name: fileName,
      hash,
      status,
      reason,
      chunks: [],
    },
  );
};

const splitChunk = (file: File) => {
  const chunk_limit = 1048576;
  const chunksTotal = Math.ceil(file.size / chunk_limit);
  const blobs: Blob[] = [];
  for (let i = 0; i < chunksTotal; i++) {
    const chunk = file.slice(i * chunk_limit, (i + 1) * chunk_limit);
    blobs.push(chunk);
  }
  return blobs;
};

const { workerFn, workerStatus } = useWebWorkerFn((file: File) => {
  return splitChunk(file);
}, {
  localDependencies: [splitChunk],
});
const pushFile = (blob: Blob[], file: File) => {
  files.value.push({
    name: file.name,
    chunks: [...blob],
    status: 'pending',
  });
  console.log(files.value);
};
const runWorker = (file: File) => {
  workerFn(file)
    .then((blob) => {
      pushFile(blob, file);
      const f = fileQueue.shift();
      if (!f) {
        return;
      }
      runWorker(f);
    });
};
const addFile = (file: File) => {
  if (file.size > storage_limit) {
    useMessage({
      type: 'danger',
      content: '文件不能超出10MB',
    });
    return;
  }
  if (workerStatus.value === 'RUNNING') {
    fileQueue.push(
      file,
    );
    return;
  }
  runWorker(file);
};

defineExpose({ addFile });
</script>

<template>
  <div class="w-full" />
</template>
