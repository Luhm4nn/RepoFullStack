import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Brevo = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();
console.log(
  'Methods on apiInstance:',
  Object.getOwnPropertyNames(Object.getPrototypeOf(apiInstance))
);
if (typeof apiInstance.sendTransacEmail === 'function') {
  console.log('sendTransacEmail is a function');
} else {
  console.log('sendTransacEmail is NOT a function');
}
