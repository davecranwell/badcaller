export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  swagger: {
    enabled: true,
    title: 'Typescript test',
    description: 'API description',
    version: '1.0',
    path: 'api',
  },
});
