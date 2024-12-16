export default defineProtectedApi(async (event) => {
  const { id } = event.context.user;
  return await sendRedirect(event, `/api/profile/${id}`);
}, ['profile::get']);
