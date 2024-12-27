<script lang="ts" setup>
type BaseFile = {
  name: string;
  hash?: string;
  chunks: Blob[];
};
type IFile = (BaseFile & { status: 'pending' }) | (BaseFile & { status: 'success' }) | (BaseFile & { status: 'fail'; reason?: string });
const files = ref<IFile[]>([]);
const { storage_limit, chunk_limit } = useRuntimeConfig();
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
  const chunksTotal = Math.ceil(file.size / chunk_limit);
  const chunksRaw = [];
  for (let i = 0; i < chunksTotal; i++) {
    const chunk = file.slice(i * chunk_limit, (i + 1) * chunk_limit);
    chunksRaw.push(chunk);
  }
};
const addFile = (file: File) => {
  if (file.size > storage_limit) {
    createFile(file.name, 'fail', '文件不能超出10MB');
    return;
  }
};
</script>

<template>
  <div class="w-full" />
</template>
