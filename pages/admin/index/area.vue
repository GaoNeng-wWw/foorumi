<template>
  <div class="w-full h-full bg-default-100 rounded-md">
    <div class="p-4">
      <app-table :data="[{ name: 'a'.repeat(100), manager: 'a' }, { name: 'a'.repeat(100), manager: 'a' }]">
        <app-table-column
          id="name"
          label="版区名称"
          :width="120"
        />
        <app-table-column
          id="manager"
          label="版区管理员"
          :width="120"
        />
        <!-- <app-table-column
          id="action"
          label="操作"
          :width="60"
        /> -->
      </app-table>
    </div>
  </div>
</template>
