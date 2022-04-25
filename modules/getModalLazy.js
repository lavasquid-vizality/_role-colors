import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default async module => {
  await Promise.resolve();
  return new Promise((resolve, reject) => {
    if (module instanceof Function.bind.constructor && module.length === 0) {
      const openModalLazy = patch(getModule(m => m.openModalLazy), 'openModalLazy', args => {
        const _function = args[0];
        args[0] = async (...args) => {
          const func = await _function(...args);

          const _module = module();
          if (_module) {
            openModalLazy();
            resolve(_module);
          }

          return func;
        };
      }, 'before');
    } else {
      reject(Error('Module is not a bound function or requires arguments'));
    }
  });
};
