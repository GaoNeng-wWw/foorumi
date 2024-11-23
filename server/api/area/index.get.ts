import prisma from '~/lib/prisma';

export default defineCachedEventHandler(async () => {
  const areas = await prisma.area.findMany({
    select: {
      name: true,
      parent: true,
      manager: {
        select: {
          name: true,
        },
      },
      manager_id: true,
      id: true,
    },
  });
  return areas ?? [];
});
