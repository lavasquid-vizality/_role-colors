import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default (Module, ...PatchArgs) => {
  if (Module instanceof Function.bind()) {
    const openModalLazy = patch(getModule(m => m.openModalLazy), 'openModalLazy', args => {
      const _function = args[0];
      args[0] = async (...args) => {
        const func = await _function(...args);

        const _Module = Module();
        if (_Module) {
          openModalLazy();

          patch(_Module, ...PatchArgs);
        }

        return func;
      };
    }, 'before');
  } else {
    console.warn(Module, 'is not a bound function');
  }
};
