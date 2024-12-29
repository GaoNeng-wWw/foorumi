<script lang="ts" setup>
import { useMessage } from '@miraiui-org/vue-message';
import SparkMd5 from 'spark-md5';

type BaseFile = {
  name: string;
  hash?: string;
  status: 'pending' | 'success' | 'fail' | 'uploading';
  reason: string;
  progress: number;
  file: File;
};
type IFile = BaseFile;
const files = ref<IFile[]>([]);
const { public: { storage_limit } } = useRuntimeConfig();
const uploadFile = (file: IFile) => {
  const formData = new FormData();
  formData.append('data', file.file);
  file.status = 'uploading';
  $fetch(
    '/api/files',
    {
      method: 'put',
      body: formData,
    },
  )
    .then(() => {
      file.progress = 1;
      file.status = 'success';
    });
};
const getHash = (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const md5 = new SparkMd5();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target!.result as string;
      md5.appendBinary(res);
      resolve(md5.end());
    };
    reader.readAsDataURL(blob);
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
  getHash(file)
    .then((hash) => {
      // file.name = hash;
      const _file: IFile = {
        name: file.name,
        status: 'pending',
        reason: '',
        progress: 0,
        file: new File([file], hash, { type: file.type, lastModified: file.lastModified }),
      };
      return _file;
    })
    .then((file) => {
      files.value.push(file);
      return file;
    })
    .then(uploadFile);
};

defineExpose({ addFile });
</script>

<template>
  <div class="w-full">
    <div
      class="flex gap-2 flex-wrap"
    >
      <transition-group
        enter-active-class="transition-all duration-normal"
        enter-from-class="-translate-y-8 opacity-0"
      >
        <comment-editor-file
          v-for="(item, idx) in files"
          :key="idx"
          :name="item.name"
          :type="item.status"
          :progress="item.status === 'uploading' ? item.progress : 100"
          @close="() => removeFile(item)"
        />
      </transition-group>
    </div>
  </div>
</template>
