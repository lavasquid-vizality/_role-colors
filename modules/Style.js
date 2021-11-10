export default (res, color, style) => {
  if (!res || !color) return;

  res.props.style = {
    ...res.props.style,
    color,
    ...style
  };
};
