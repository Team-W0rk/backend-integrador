const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const containerModule = require('./node_modules/@nestjs/core/injector/container.js');
const originalAddProvider = containerModule.NestContainer.prototype.addProvider;
containerModule.NestContainer.prototype.addProvider = function(provider, token, enhancerSubtype) {
  let providerType = typeof provider;
  let providerName = providerType === 'object' ? JSON.stringify(provider) : provider?.name;
  console.error('addProvider', providerName, 'token', token?.name || token, 'providerType', providerType);
  const result = originalAddProvider.call(this, provider, token, enhancerSubtype);
  console.error('  -> result', result);
  return result;
};
(async () => {
  try {
    await NestFactory.create(AppModule);
    console.log('created');
  } catch (e) {
    console.error('caught', e);
    process.exit(1);
  }
})();
