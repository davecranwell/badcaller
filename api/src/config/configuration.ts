export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  swagger: {
    enabled: true,
    title: 'Badcaller API',
    description: null,
    version: '1.0',
    path: 'docs',
  },
});
