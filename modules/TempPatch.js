export default (oldFunction, name, newFunction, newArgsFunction) => {
  const _Name = oldFunction?.[name];
  if (!_Name || typeof _Name !== 'function') return;
  oldFunction[name] = (...args) => {
    if (newArgsFunction) {
      const newArgs = newArgsFunction(...args);
      args[0] = {
        ...args[0],
        ...newArgs
      };
    }
    const Name = _Name(...args);
    if (newFunction) newFunction(Name);
    return Name;
  };
  oldFunction[name].displayName = _Name.displayName;
};
