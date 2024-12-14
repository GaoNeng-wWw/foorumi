export const NORMAL_SELECT = {
  content: true,
  create_at: true,
  update_at: true,
  floor: true,
  author: {
    include: {
      account: {
        select: {
          id: true,
          profile: {
            select: {
              name: true,
              bio: true,
            },
          },
        },
      },
    },
  },
};

export const HIDDEN_THREAD = {
  ...NORMAL_SELECT,
  hidden: true,
  hidden_reason: true,
};
